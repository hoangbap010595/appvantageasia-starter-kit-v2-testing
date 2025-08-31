import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import type {
    RunBasicAuthenticationMutation,
    RunBasicAuthenticationMutationVariables,
} from '../api/BasicAuthentication.api';
import { RunBasicAuthenticationDocument } from '../api/BasicAuthentication.api';
import type { SignInValues } from './Form';

const useSignIn = () => {
    const apolloClient = useApolloClient();

    return useCallback(
        async (values: SignInValues) => {
            const mutation = await apolloClient.mutate<
                RunBasicAuthenticationMutation,
                RunBasicAuthenticationMutationVariables
            >({
                mutation: RunBasicAuthenticationDocument,
                variables: { ...values },
            });

            return mutation.data!.runBasicAuthentication;
        },
        [apolloClient]
    );
};

export default useSignIn;
