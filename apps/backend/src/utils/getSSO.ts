import { msalAuthentication, oidcAuthentication } from '@appvantageasia/core-users';

export interface SSO {
    type: 'msal' | 'oidc';
    enforced: boolean;
}

const getSSO = async (): Promise<SSO | null> => {
    const msalConfig = await msalAuthentication.getConfig();

    if (msalConfig) {
        return { type: 'msal', enforced: msalConfig.enforced };
    }

    const oidcConfig = await oidcAuthentication.getConfig();

    if (oidcConfig) {
        return { type: 'oidc', enforced: oidcConfig.enforced };
    }

    return null;
};

export default getSSO;
