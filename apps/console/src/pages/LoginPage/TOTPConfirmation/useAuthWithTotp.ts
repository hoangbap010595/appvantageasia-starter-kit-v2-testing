import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import type { AuthenticateWithOtpMutation, AuthenticateWithOtpMutationVariables } from '../api/AuthenticateWithOtp.api';
import { AuthenticateWithOtpDocument } from '../api/AuthenticateWithOtp.api';
import type { TotpFormValues } from './Form';

const useAuthWithTotp = (token: string) => {
    const apolloClient = useApolloClient();

    return useCallback(
        async (values: TotpFormValues) => {
            const mutation = await apolloClient.mutate<
                AuthenticateWithOtpMutation,
                AuthenticateWithOtpMutationVariables
            >({
                mutation: AuthenticateWithOtpDocument,
                variables: { token, password: values.password },
            });

            return mutation.data!.runBasicAuthentication;
        },
        [apolloClient, token]
    );
};

export default useAuthWithTotp;
