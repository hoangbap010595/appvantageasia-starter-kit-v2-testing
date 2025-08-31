import { useMemo, useReducer } from 'react';
import { useLocation } from 'react-router';

export type State =
    | { step: 'authenticate' }
    | { step: 'passwordExpired'; token: string }
    | { step: 'totp'; token: string }
    | { step: 'oidc'; code: string; state?: string }
    | { step: 'msal'; code: string };

type Action =
    | { type: 'moveToPasswordExpired'; token: string }
    | { type: 'moveToTOTP'; token: string }
    | { type: 'reset' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'moveToPasswordExpired':
            return { step: 'passwordExpired', token: action.token };

        case 'moveToTOTP':
            return { step: 'totp', token: action.token };

        case 'reset':
            return { step: 'authenticate' };

        default:
            return state;
    }
};

export interface ActionHandlers {
    moveToPasswordExpired: (token: string) => void;
    moveToTOTP: (token: string) => void;
    goBackToAuthenticate: () => void;
}

const useStep = () => {
    const defaultState = useLocation().state as { signInState?: State } | undefined;
    const [state, dispatch] = useReducer(reducer, defaultState?.signInState || { step: 'authenticate' });

    const actions = useMemo(
        (): ActionHandlers => ({
            moveToPasswordExpired: (token: string) => dispatch({ type: 'moveToPasswordExpired', token }),
            moveToTOTP: (token: string) => dispatch({ type: 'moveToTOTP', token }),
            goBackToAuthenticate: () => dispatch({ type: 'reset' }),
        }),
        []
    );

    return { state, actions };
};

export default useStep;
