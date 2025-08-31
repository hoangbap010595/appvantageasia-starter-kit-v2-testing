import { useCallback, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Submitted from './Submitted';
import useResetPassword from './useResetPassword';
import LoginPortalLayout from '@/components/blocks/LoginPortalLayout';
import ResetPasswordForm, { useResetPasswordForm } from '@/pages/LoginPage/ResetPassword/Form';
import type { ResetPasswordFormValues } from '@/pages/LoginPage/ResetPassword/Form';

interface ResetPasswordProps {
    token: string;
}
const ResetPassword = ({ token }: ResetPasswordProps) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { t } = useTranslation('loginPage');

    const form = useResetPasswordForm();
    const resetPassword = useResetPassword(token);
    const onSubmit = useCallback<SubmitHandler<ResetPasswordFormValues>>(
        async data => {
            const response = await resetPassword(data);

            if (response.__typename === 'ResetPasswordSuccessfulResponse') {
                setIsSubmitted(true);

                return;
            }

            if (response.__typename !== 'ErrorResponse') {
                throw new Error('unexpected');
            }

            // display the error message
            response.fields?.forEach(error => {
                form.setError(
                    error.field as any,
                    { type: 'backend', message: error.message },
                    // for this form specifically we set the focus on password only
                    { shouldFocus: error.field === 'password' }
                );
            });
        },
        [form, resetPassword]
    );

    const content = isSubmitted ? (
        <Submitted />
    ) : (
        <FormProvider {...form}>
            <ResetPasswordForm onSubmit={onSubmit} />
        </FormProvider>
    );

    return <LoginPortalLayout title={t('loginPage:newPassword.title')}>{content}</LoginPortalLayout>;
};

export default ResetPassword;
