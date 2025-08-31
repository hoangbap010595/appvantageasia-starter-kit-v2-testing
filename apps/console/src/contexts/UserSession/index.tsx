import { useApolloClient } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import dayjs from 'dayjs';
import type { ReactNode } from 'react';
import { useEffect, createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { ExtendSessionMutation, ExtendSessionMutationVariables } from './ExtendSession.api';
import { ExtendSessionDocument } from './ExtendSession.api';
import type { CurrentUserFragment } from './Usersession.api';
import { useFetchCurrentUserQuery } from './Usersession.api';
import Loader from '@/components/common/Loader';
import extractFromJWT from '@/utils/extractFromJWT';
import { getToken, updateToken, onTokenUpdate } from '@/utils/session';

export interface ContextValue {
    token: string | null;
    user: CurrentUserFragment | null;
    sessionId: string | null;
    logout: () => void;
}

export const Context = createContext<ContextValue | null>(null);

export const useUserSession = () => {
    const context = useContext(Context);

    if (!context) {
        throw new Error('useUserSession must be used within a UserSessionProvider');
    }

    return context;
};

export function useUser(shouldThrowIfNull: true): CurrentUserFragment;
export function useUser(shouldThrowIfNull: false | undefined): CurrentUserFragment | null;
export function useUser(shouldThrowIfNull?: boolean): CurrentUserFragment | null;
export function useUser(shouldThrowIfNull = false): CurrentUserFragment | null {
    const { user } = useUserSession(); // Assuming useUserSession is correctly defined and imported

    if (shouldThrowIfNull && !user) {
        throw new Error('User is not available');
    }

    return user;
}

export interface UserSessionProviderProps {
    children: ReactNode;
}

const UserSessionProvider = ({ children }: UserSessionProviderProps) => {
    // get the initial token from the session
    // forcefully run validation when retrieving it
    const [currentToken, setCurrentToken] = useState(() => getToken(true));

    const sessionId = useMemo(() => {
        if (currentToken) {
            return (extractFromJWT(currentToken) as { sessionId: { $oid: string } }).sessionId.$oid as string;
        }

        return null;
    }, [currentToken]);

    // listen for token updates and update the state
    useEffect(() => onTokenUpdate(setCurrentToken), [setCurrentToken]);

    const navigate = useNavigate();
    const logout = useCallback(() => {
        updateToken(null);
        navigate('/login', { replace: true });
    }, [navigate]);

    // query to fetch user document
    const { data, refetch, loading } = useFetchCurrentUserQuery({
        // use network only policy to avoid returning stale data
        fetchPolicy: 'cache-and-network',
        skip: !currentToken,
    });

    const apolloClient = useApolloClient();

    // the following effect is responsible for refreshing the token
    useEffect(() => {
        if (!currentToken) {
            // there's nothing to be done if there is no token
            return () => undefined;
        }

        const { exp } = extractFromJWT(currentToken);
        const expirationDate = dayjs(exp * 1000);
        const delayBeforeExpiration = expirationDate.subtract(1, 'minute').diff(dayjs(), 'millisecond');

        // in browser the real type is `number`
        let timeoutId: NodeJS.Timeout | null = null;
        let mounted = true;

        const refreshToken = async () => {
            if (expirationDate.isBefore(dayjs())) {
                // we don't refresh if the token is expired
                timeoutId = null;
                logout();
            } else {
                timeoutId = null;
                // try to refresh the token
                try {
                    const response = await apolloClient.mutate<ExtendSessionMutation, ExtendSessionMutationVariables>({
                        mutation: ExtendSessionDocument,
                    });

                    updateToken(response?.data?.token || null);
                } catch (error) {
                    // print it out
                    console.info('Failed to renew the session');
                    console.error(error);
                    if (mounted) {
                        // if fail trigger a new refresh soon
                        timeoutId = setTimeout(refreshToken, 500);
                    }
                }
            }
        };

        timeoutId = setTimeout(refreshToken, delayBeforeExpiration);

        return () => {
            mounted = false;

            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [currentToken, logout, apolloClient]);

    // we want to refetch the user document whenever the token changed
    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentToken]);

    const context = useMemo(
        (): ContextValue => ({
            token: currentToken,
            // if there's no token then we right away nullify the user document
            user: currentToken ? data?.currentUser || null : null,
            sessionId,
            logout,
        }),
        [currentToken, data, sessionId, logout]
    );

    useEffect(() => {
        Sentry.setUser(context.user ? { id: context.user.id, email: context.user.email } : null);
    }, [context]);

    if (context.token && !context?.user && loading) {
        return <Loader height="screen" />;
    }

    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default UserSessionProvider;
