import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import Button from '@/components/common/Button';
import InputField from '@/components/fields/InputField';

const createSchema = (t: TFunction) => {
    const requiredError = t('common:formErrors.required');

    return z
        .object({
            password: z.string({ error: requiredError }).min(6, t('common:formErrors.invalidPassword')),
        })
        .required();
};

export type InputValues = z.input<ReturnType<typeof createSchema>>;

export type OutputValues = z.output<ReturnType<typeof createSchema>>;

const useFormSchema = () => {
    const { t } = useTranslation('common');

    return useMemo(() => zodResolver(createSchema(t)), [t]);
};

export const useTotpForm = () => {
    const resolver = useFormSchema();
    const form = useForm<InputValues, any, OutputValues>({ resolver });

    return form;
};

export interface TotpFormValues {
    password: string;
}

interface TOTPConfirmationFormProps {
    onSubmit: SubmitHandler<TotpFormValues>;
}

const TOTPConfirmationForm = ({ onSubmit }: TOTPConfirmationFormProps) => {
    const { t } = useTranslation('loginPage');

    const form = useFormContext<TotpFormValues>();
    const { formState, handleSubmit } = form;

    return (
        <form className="space-y-6" data-cy="totpConfirmForm" onSubmit={handleSubmit(onSubmit)}>
            <InputField
                {...t('loginPage:totpStep.fields.code', { returnObjects: true })}
                maxLength={6}
                name="password"
            />
            <Button className="w-full" color="primary" disabled={formState.isSubmitting} type="submit">
                {t(`loginPage:totpStep.${formState.isSubmitting ? 'submitting' : 'submitBtn'}`)}
            </Button>
        </form>
    );
};

export default TOTPConfirmationForm;
