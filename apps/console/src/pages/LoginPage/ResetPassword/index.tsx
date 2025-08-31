import { useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useBasicAuthenticationResponse from '../useBasicAuthenticationResponse';
import type { ActionHandlers } from '../useStep';
import type { ResetPasswordFormValues } from './Form';
import ResetPasswordForm, { useResetPasswordForm } from './Form';
import useAuthWithResetPassword from './useAuthWithResetPassword';
import LoginPortalLayout from '@/components/blocks/LoginPortalLayout';

interface ResetPasswordStepProps {
    actions: ActionHandlers;
    token: string;
}

const ResetPasswordStep = ({ actions, token }: ResetPasswordStepProps) => {
    const { t } = useTranslation('loginPage');

    const form = useResetPasswordForm();
    const authenticateWithOtp = useAuthWithResetPassword(token);
    const responseHandler = useBasicAuthenticationResponse();
    const onSubmit = useCallback<SubmitHandler<ResetPasswordFormValues>>(
        async data => {
            const response = await authenticateWithOtp(data);

            responseHandler({ response, form, actions });
        },
        [authenticateWithOtp, responseHandler, form, actions]
    );

    return (
        <LoginPortalLayout title={t('loginPage:newPassword.title')}>
            <FormProvider {...form}>
                <ResetPasswordForm onSubmit={onSubmit} />
            </FormProvider>
        </LoginPortalLayout>
    );
};

export default ResetPasswordStep;
