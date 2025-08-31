import { useApolloClient } from '@apollo/client';
import { startTransition, useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import type { RunBasicAuthenticationMutation } from './api/BasicAuthentication.api';
import type { ActionHandlers } from './useStep';
import { CurrentUserFragmentDoc } from '@/contexts/UserSession/Usersession.api';
import { updateToken } from '@/utils/session';

export interface BasicAuthenticationResponseHandlerProps {
    response: RunBasicAuthenticationMutation['runBasicAuthentication'];
    form?: UseFormReturn<any>;
    actions?: ActionHandlers;
}

const useBasicAuthenticationResponse = () => {
    const apolloClient = useApolloClient();
    const { state } = useLocation();
    const redirectTo = state?.from || '/';
    const redirectToState = state?.fromState;
    const navigate = useNavigate();

    return useCallback(
        ({ response, form, actions }: BasicAuthenticationResponseHandlerProps) => {
            if (response.__typename === 'BasicAuthenticationSuccessfulResponse') {
                startTransition(() => {
                    apolloClient.writeFragment({
                        id: `User:${response.user.id}`,
                        fragment: CurrentUserFragmentDoc,
                        data: response.user,
                    });

                    updateToken(response.token);

                    // redirect to the page initially requested (or the default otherwise)
                    // we also restore any state eventually here
                    // as well as adding the information we just came from a successful authentication
                    navigate(redirectTo, { replace: true, state: { ...redirectToState, isAuthenticated: true } });
                });

                return;
            }

            if (response.__typename === 'BasicAuthenticationResetPasswordResponse') {
                actions?.moveToPasswordExpired(response.token);

                return;
            }

            if (response.__typename === 'BasicAuthenticationRequireOtpResponse') {
                actions?.moveToTOTP(response.token);

                return;
            }

            if (response.__typename !== 'ErrorResponse') {
                throw new Error('unexpected');
            }

            if (form) {
                // display the error message in the form
                response.fields?.forEach(error => {
                    form.setError(
                        error.field as any,
                        { type: 'backend', message: error.message },
                        // for this form specifically we set the focus on password only
                        { shouldFocus: error.field === 'password' }
                    );
                });
            }
        },
        [apolloClient, navigate, redirectTo, redirectToState]
    );
};

export default useBasicAuthenticationResponse;
