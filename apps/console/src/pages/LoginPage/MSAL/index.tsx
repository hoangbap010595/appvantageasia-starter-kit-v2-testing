import { useApolloClient } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AuthWithMsalMutation, AuthWithMsalMutationVariables } from '../api/sso.api';
import { AuthWithMsalDocument } from '../api/sso.api';
import useBasicAuthenticationResponse from '../useBasicAuthenticationResponse';

import type { ActionHandlers } from '../useStep';
import LoginPortalLayout from '@/components/blocks/LoginPortalLayout';
import Alert from '@/components/common/Alert';
import Loader from '@/components/common/Loader';

export interface MSALProps {
    actions: ActionHandlers;
    code: string;
}

const MSAL = ({ code, actions }: MSALProps) => {
    const { t } = useTranslation('loginPage');
    const apolloClient = useApolloClient();
    const responseHandler = useBasicAuthenticationResponse();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apolloClient
            .mutate<AuthWithMsalMutation, AuthWithMsalMutationVariables>({
                mutation: AuthWithMsalDocument,
                variables: { code },
            })
            .then(({ data }) => {
                if (data) {
                    if (data.runBasicAuthentication.__typename !== 'ErrorResponse') {
                        responseHandler({
                            response: data.runBasicAuthentication,
                            actions,
                        });
                    } else {
                        setError(
                            data.runBasicAuthentication.fields?.find(field => field.field === '$root')?.message ||
                                'An error occurred'
                        );
                    }
                }
            });
    }, [code, apolloClient, actions, responseHandler, setError]);

    return (
        <LoginPortalLayout title={t('loginPage:msalStep.title')}>
            {error ? <Alert title={error} type="error" /> : <Loader />}
        </LoginPortalLayout>
    );
};

export default MSAL;
