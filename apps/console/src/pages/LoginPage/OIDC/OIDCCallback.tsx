import { useMemo } from 'react';
import { useLocation } from 'react-router';
import type { State } from '../useStep';
import RedirectTo from '@/RedirectTo';

const OIDCCallbak = () => {
    const { search } = useLocation();

    const state = useMemo<{ signInState: State }>(() => {
        const params = new URLSearchParams(search);
        const code = params.get('code')!;
        const state = params.get('state') || undefined; // replace null by undefined

        return { signInState: { step: 'oidc', code, state } };
    }, [search]);

    return <RedirectTo state={state} to="/login" replace />;
};

export default OIDCCallbak;
