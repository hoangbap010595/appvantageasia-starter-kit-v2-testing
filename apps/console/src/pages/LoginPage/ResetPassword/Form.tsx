import { regexp } from '@appvantageasia/core-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import PasswordRequirement, { useValidatePassword } from '@/components/blocks/PasswordRequirement';
import Button from '@/components/common/Button';
import PasswordField from '@/components/fields/PasswordField';

const createSchema = (t: TFunction) => {
    const requiredError = t('common:formErrors.required');

    return z
        .object({
            password: z
                .string({ error: requiredError })
                .min(8, t('common:formErrors.invalidPassword'))
                .regex(regexp.password, t('common:formErrors.invalidPassword')),
            passwordRepeat: z.string({ error: requiredError }),
        })
        .required()
        .refine(data => data.password === data.passwordRepeat, {
            error: t('common:formErrors.passwordsDoNotMatch'),
            path: ['passwordRepeat'],
        });
};

export type InputValues = z.input<ReturnType<typeof createSchema>>;

export type OutputValues = z.output<ReturnType<typeof createSchema>>;

const useFormSchema = () => {
    const { t } = useTranslation('common');

    return useMemo(() => zodResolver(createSchema(t)), [t]);
};

export const useResetPasswordForm = () => {
    const resolver = useFormSchema();
    const form = useForm<InputValues, any, OutputValues>({ resolver });

    return form;
};

export interface ResetPasswordFormValues {
    password: string;
    passwordRepeat: string;
}

interface RequestNewPasswordFormProps {
    onSubmit: SubmitHandler<ResetPasswordFormValues>;
}

const ResetPasswordForm = ({ onSubmit }: RequestNewPasswordFormProps) => {
    const { t } = useTranslation('loginPage');
    const form = useFormContext<ResetPasswordFormValues>();
    const { formState, watch, handleSubmit } = form;

    const validatePassword = useValidatePassword();

    return (
        <form className="space-y-6" data-cy="resetPasswordForm" onSubmit={handleSubmit(onSubmit)}>
            <PasswordField {...t(`loginPage:newPassword.fields.password`, { returnObjects: true })} name="password" />
            <PasswordField
                {...t(`loginPage:newPassword.fields.passwordRepeat`, { returnObjects: true })}
                name="passwordRepeat"
            />
            <PasswordRequirement requirements={validatePassword(watch('password'))} />
            <Button className="w-full" color="primary" disabled={formState.isSubmitting} type="submit">
                {t(`loginPage:newPassword.${formState.isSubmitting ? 'submitting' : 'submitBtn'}`)}
            </Button>
        </form>
    );
};

export default ResetPasswordForm;
