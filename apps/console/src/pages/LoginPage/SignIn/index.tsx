import { useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useBasicAuthenticationResponse from '../useBasicAuthenticationResponse';
import type { ActionHandlers } from '../useStep';
import type { SignInValues } from './Form';
import SignInForm, { useSignInForm } from './Form';
import useSignIn from './useSignIn';
import LoginPortalLayout from '@/components/blocks/LoginPortalLayout';

export interface SignInStepProps {
    actions: ActionHandlers;
}

const SignInStep = ({ actions }: SignInStepProps) => {
    const { t } = useTranslation('loginPage');

    const form = useSignInForm();
    const signIn = useSignIn();
    const responseHandler = useBasicAuthenticationResponse();
    const onSubmit = useCallback<SubmitHandler<SignInValues>>(
        async data => {
            const response = await signIn(data);

            responseHandler({ response, form, actions });
        },
        [form, signIn, responseHandler, actions]
    );

    return (
        <LoginPortalLayout title={t('loginPage:authenticateStep.title')}>
            <FormProvider {...form}>
                <SignInForm onSubmit={onSubmit} />
            </FormProvider>
        </LoginPortalLayout>
    );
};

export default SignInStep;
