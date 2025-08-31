import { useLocation } from 'react-router';
import MSAL from './MSAL';
import OIDC from './OIDC';
import ResetPasswordStep from './ResetPassword';
import SSOEnforcer from './SSOEnforcer';
import SignInStep from './SignIn';
import TOTPConfirmationStep from './TOTPConfirmation';
import TokenExpired from './TokenExpired';
import useStep from './useStep';
import TokenExpirationController from '@/components/TokenExpirationController';
import Loader from '@/components/common/Loader';
import runtime from '@/runtime';

const LoginPage = () => {
    const { state, actions } = useStep();

    // sometimes there is a lag between authentication and the context being updated properly
    // most likely due to many delay in ticks between react/apollo/pubsub
    // so we look at a state variables to skip unhealthy behaviors
    // especially in SSO in which we have a redirection loops when SSO is enforced
    const location = useLocation();
    const isAuthenticated = !!location.state?.isAuthenticated || !!location.state?.fromState?.isAuthenticated;

    if (isAuthenticated) {
        return <Loader />;
    }

    const tokenExpiredFallback = <TokenExpired actions={actions} />;

    switch (state.step) {
        case 'authenticate':
            if (runtime.sso?.enforced) {
                return <SSOEnforcer />;
            }

            return <SignInStep actions={actions} />;

        case 'passwordExpired':
            return (
                <TokenExpirationController fallback={tokenExpiredFallback} token={state.token}>
                    <ResetPasswordStep actions={actions} token={state.token} />
                </TokenExpirationController>
            );

        case 'totp':
            return (
                <TokenExpirationController fallback={tokenExpiredFallback} token={state.token}>
                    <TOTPConfirmationStep actions={actions} token={state.token} />
                </TokenExpirationController>
            );

        case 'msal':
            return <MSAL actions={actions} code={state.code} />;

        case 'oidc':
            return <OIDC actions={actions} code={state.code} state={state.state} />;

        default:
            return null;
    }
};

export default LoginPage;
