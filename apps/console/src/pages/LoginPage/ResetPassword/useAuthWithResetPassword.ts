import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import type {
    AuthenticateWithResetPasswordMutation,
    AuthenticateWithResetPasswordMutationVariables,
} from '../api/AuthenticateWithResetPassword.api';
import { AuthenticateWithResetPasswordDocument } from '../api/AuthenticateWithResetPassword.api';
import type { ResetPasswordFormValues } from './Form';

const useAuthWithResetPassword = (token: string) => {
    const apolloClient = useApolloClient();

    return useCallback(
        async (values: ResetPasswordFormValues) => {
            const mutation = await apolloClient.mutate<
                AuthenticateWithResetPasswordMutation,
                AuthenticateWithResetPasswordMutationVariables
            >({
                mutation: AuthenticateWithResetPasswordDocument,
                variables: { token, password: values.password },
            });

            return mutation.data!.runBasicAuthentication;
        },
        [apolloClient, token]
    );
};

export default useAuthWithResetPassword;
