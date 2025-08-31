import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import type { ResetPasswordMutation, ResetPasswordMutationVariables } from '../api/ResetPassword.api';
import { ResetPasswordDocument } from '../api/ResetPassword.api';
import type { ResetPasswordFormValues } from '@/pages/LoginPage/ResetPassword/Form';

const useResetPassword = (token: string) => {
    const apolloClient = useApolloClient();

    return useCallback(
        async (values: ResetPasswordFormValues) => {
            const mutation = await apolloClient.mutate<ResetPasswordMutation, ResetPasswordMutationVariables>({
                mutation: ResetPasswordDocument,
                variables: { token, password: values.password },
            });

            return mutation.data!.resetPassword;
        },
        [apolloClient, token]
    );
};

export default useResetPassword;
