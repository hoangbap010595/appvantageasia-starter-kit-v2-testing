import { useMemo } from 'react';
import { useLocation } from 'react-router';
import type { State } from '../useStep';
import RedirectTo from '@/RedirectTo';

const MSALCallback = () => {
    const { search } = useLocation();

    const state = useMemo<{ signInState: State }>(() => {
        const code = new URLSearchParams(search).get('code')!;

        return { signInState: { step: 'msal', code } };
    }, [search]);

    return <RedirectTo state={state} to="/login" replace />;
};

export default MSALCallback;
