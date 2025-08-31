import { msalAuthentication, oidcAuthentication } from '@appvantageasia/core-users';
import { requiresLoggedUser } from '../../decorators.js';
import type { SSOConfiguration } from '../../mapped-types.js';
import type { GqlQueryResolvers } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';

const resolver: GqlQueryResolvers['ssoConfiguration'] = requiresLoggedUser<GqlQueryResolvers['ssoConfiguration']>(
    async (root, args, context, info): Promise<SSOConfiguration | null> => {
        const { getAbilities, user } = context;
        const abilities = await getAbilities();

        if (!abilities.canManageSystem()) {
            return throwPermissionDenied(info, user);
        }

        const msal = await msalAuthentication.getConfig();

        if (msal) {
            return { __type: 'MSALConfiguration', ...msal };
        }

        const oidc = await oidcAuthentication.getConfig();

        if (oidc) {
            return { __type: 'OIDCConfiguration', ...oidc };
        }

        return null;
    }
);

export default resolver;
