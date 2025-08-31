import { useApolloClient } from '@apollo/client';
import { useCallback, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import type { RequestNewPasswordMutation, RequestNewPasswordMutationVariables } from '../api/RequestNewPassword.api';
import { RequestNewPasswordDocument } from '../api/RequestNewPassword.api';
import type { RequestNewPasswordFormValues } from './Form';
import Form, { useRequestNewPasswordForm } from './Form';
import Submitted from './Submitted';
import LoginPortalLayout from '@/components/blocks/LoginPortalLayout';

const RequestNewPassword = () => {
    const { email } = useLocation().state as { email: string };
    const { t } = useTranslation('loginPage');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useRequestNewPasswordForm({ email });

    const apolloClient = useApolloClient();
    const onSubmit = useCallback(
        async (values: RequestNewPasswordFormValues) => {
            const mutation = await apolloClient.mutate<RequestNewPasswordMutation, RequestNewPasswordMutationVariables>(
                {
                    mutation: RequestNewPasswordDocument,
                    variables: values,
                }
            );

            const response = mutation.data!.requestNewPassword;

            if (response.__typename === 'RequestNewPasswordSuccessfulResponse') {
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
        [apolloClient, form]
    );

    const content = isSubmitted ? (
        <Submitted />
    ) : (
        <FormProvider {...form}>
            <Form onSubmit={onSubmit} />
        </FormProvider>
    );

    return <LoginPortalLayout title={t('loginPage:requestNewPassword.title')}>{content}</LoginPortalLayout>;
};

export default RequestNewPassword;
