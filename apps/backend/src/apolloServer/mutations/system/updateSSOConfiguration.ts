import type { MSALConfig, OIDCConfig } from '@appvantageasia/core-auth';
import { msalAuthentication, oidcAuthentication } from '@appvantageasia/core-users';
import { requiresLoggedUser } from '../../decorators.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';

const resolver = requiresLoggedUser<GqlMutationResolvers['updateSSOConfiguration']>(
    async (root, args, context, info) => {
        const { getAbilities, user } = context;
        const abilities = await getAbilities();

        if (!abilities.canManageSystem()) {
            return throwPermissionDenied(info, user);
        }

        // by default it will look like we disable all SSO methods
        const update: { msal: MSALConfig | null; oidc: OIDCConfig | null } = {
            msal: null,
            oidc: null,
        };

        const { msal, oidc } = args.sso;

        if (msal) {
            const originalMSAL = await msalAuthentication.getConfig();

            // ensure the secret will be here if it's the first time
            if (!originalMSAL && !msal.clientSecret) {
                return {
                    __typename: 'ErrorResponse',
                    fields: [{ field: 'clientSecret', message: 'Client Secret is mandatory first time' }],
                };
            }

            // use TS type on a variable to validate the whole object
            const newMSALConfig: MSALConfig = {
                ...msal,
                // re-use existing client secret if not provided
                clientSecret: msal.clientSecret || originalMSAL!.clientSecret,
            };

            update.msal = newMSALConfig;
        } else if (oidc) {
            const originalOIDC = await oidcAuthentication.getConfig();

            // ensure the secret will be here if it's the first time
            if (!originalOIDC && !oidc.clientSecret) {
                return {
                    __typename: 'ErrorResponse',
                    fields: [{ field: 'clientSecret', message: 'Client Secret is mandatory first time' }],
                };
            }

            // use TS type on a variable to validate the whole object
            const newOIDCConfig: OIDCConfig = {
                ...oidc,
                // re-use existing client secret if not provided
                clientSecret: oidc.clientSecret || originalOIDC!.clientSecret,
            };

            update.oidc = newOIDCConfig;
        }

        // update the system
        await oidcAuthentication.updateConfig(update.oidc);
        await msalAuthentication.updateConfig(update.msal);

        if (update.msal) {
            return {
                __typename: 'UpdateSSOSuccessfulResponse',
                result: { __type: 'MSALConfiguration', ...update.msal },
            };
        }

        if (update.oidc) {
            return {
                __typename: 'UpdateSSOSuccessfulResponse',
                result: { __type: 'OIDCConfiguration', ...update.oidc },
            };
        }

        return {
            __typename: 'UpdateSSOSuccessfulResponse',
            result: null,
        };
    }
);

export default resolver;
