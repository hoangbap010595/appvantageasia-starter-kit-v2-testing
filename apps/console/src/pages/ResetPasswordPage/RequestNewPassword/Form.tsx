import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import Button from '@/components/common/Button';
import InputField from '@/components/fields/InputField';

const createSchema = (t: TFunction) => {
    const requiredError = t('common:formErrors.required');

    return z
        .object({
            email: z.string({ error: requiredError }).email(t('common:formErrors.invalidEmail')),
        })
        .required();
};

const useFormSchema = () => {
    const { t } = useTranslation('common');

    return useMemo(() => zodResolver(createSchema(t)), [t]);
};

export interface RequestNewPasswordFormValues {
    email: string;
}

export const useRequestNewPasswordForm = (defaultValues?: Partial<RequestNewPasswordFormValues>) => {
    const resolver = useFormSchema();

    return useForm<RequestNewPasswordFormValues>({ resolver, defaultValues });
};

interface RequestNewPasswordFormProps {
    onSubmit: (value: { email: string }) => void;
}

const RequestNewPasswordForm = ({ onSubmit }: RequestNewPasswordFormProps) => {
    const { t } = useTranslation('loginPage');
    const form = useFormContext<RequestNewPasswordFormValues>();
    const { formState, handleSubmit } = form;

    return (
        <form className="space-y-6" data-cy="requestNewPasswordForm" onSubmit={handleSubmit(onSubmit)}>
            <InputField {...t('loginPage:requestNewPassword.fields.email', { returnObjects: true })} name="email" />
            <Button className="w-full" color="primary" disabled={formState.isSubmitting} type="submit">
                {t(`loginPage:requestNewPassword.${formState.isSubmitting ? 'submitting' : 'submitBtn'}`)}
            </Button>
        </form>
    );
};

export default RequestNewPasswordForm;
