import { useApolloClient } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AuthWithOidcMutation, AuthWithOidcMutationVariables } from '../api/sso.api';
import { AuthWithOidcDocument } from '../api/sso.api';
import useBasicAuthenticationResponse from '../useBasicAuthenticationResponse';

import type { ActionHandlers } from '../useStep';
import LoginPortalLayout from '@/components/blocks/LoginPortalLayout';
import Alert from '@/components/common/Alert';
import Loader from '@/components/common/Loader';

export interface OIDCProps {
    actions: ActionHandlers;
    code: string;
    state?: string;
}

const OIDC = ({ code, actions, state }: OIDCProps) => {
    const { t } = useTranslation('loginPage');
    const apolloClient = useApolloClient();
    const responseHandler = useBasicAuthenticationResponse();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apolloClient
            .mutate<AuthWithOidcMutation, AuthWithOidcMutationVariables>({
                mutation: AuthWithOidcDocument,
                variables: { code, state },
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
    }, [code, state, apolloClient, actions, responseHandler, setError]);

    return (
        <LoginPortalLayout title={t('loginPage:oidcStep.title')}>
            {error ? <Alert title={error} type="error" /> : <Loader />}
        </LoginPortalLayout>
    );
};

export default OIDC;
