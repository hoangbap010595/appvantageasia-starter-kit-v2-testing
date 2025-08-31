import { useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useBasicAuthenticationResponse from '../useBasicAuthenticationResponse';
import type { ActionHandlers } from '../useStep';
import type { TotpFormValues } from './Form';
import TOTPConfirmationForm, { useTotpForm } from './Form';
import useAuthWithTotp from './useAuthWithTotp';
import LoginPortalLayout from '@/components/blocks/LoginPortalLayout';

interface TOTPConfirmationStepProps {
    actions: ActionHandlers;
    token: string;
}

const TOTPConfirmationStep = ({ actions, token }: TOTPConfirmationStepProps) => {
    const { t } = useTranslation('loginPage');
    const form = useTotpForm();
    const authenticateWithOtp = useAuthWithTotp(token);
    const responseHandler = useBasicAuthenticationResponse();
    const onSubmit = useCallback<SubmitHandler<TotpFormValues>>(
        async data => {
            const response = await authenticateWithOtp(data);

            responseHandler({ response, form, actions });
        },
        [authenticateWithOtp, responseHandler, form, actions]
    );

    return (
        <LoginPortalLayout description={t('loginPage:totpStep.description')} title={t('loginPage:totpStep.title')}>
            <FormProvider {...form}>
                <TOTPConfirmationForm onSubmit={onSubmit} />
            </FormProvider>
        </LoginPortalLayout>
    );
};

export default TOTPConfirmationStep;
