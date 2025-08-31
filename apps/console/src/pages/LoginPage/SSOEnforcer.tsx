import { useApolloClient } from '@apollo/client';
import { useEffect } from 'react';
import goToMSAL from './MSAL/goToMSAL';
import goToOIDC from './OIDC/goToOIDC';
import Loader from '@/components/common/Loader';
import runtime from '@/runtime';

const { sso } = runtime;

const SSOEnforcer = () => {
    if (!sso) {
        throw new Error('SSO is not enabled');
    }

    const apolloClient = useApolloClient();

    useEffect(() => {
        switch (sso.type) {
            case 'msal':
                goToMSAL(apolloClient);
                break;

            case 'oidc':
                goToOIDC(apolloClient);
                break;

            default:
                break;
        }
    }, [apolloClient]);

    return <Loader />;
};

export default SSOEnforcer;
