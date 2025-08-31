import { otpAuthentication } from '@appvantageasia/core-users';
import type { GqlUserResolvers } from '../resolver-types.js';
import throwPermissionDenied from '../throwPermissionDenied.js';

const resolver: GqlUserResolvers = {
    id: parent => parent._id,
    otpAuthenticator: async (parent, args, { getAbilities, user }, info) => {
        const abilities = await getAbilities();

        if (abilities.canReadUserSensitiveData(parent)) {
            const profile = otpAuthentication.getProfile(parent);

            if (profile) {
                return { date: profile?.date };
            }

            return null;
        }

        return throwPermissionDenied(info, user);
    },
    isSuperAdmin: async (parent, _, { getAbilities, user }, info) => {
        const abilities = await getAbilities();

        if (abilities.canReadUserSensitiveData(parent) || abilities.canManageUsers()) {
            return parent.isSuperAdmin;
        }

        return throwPermissionDenied(info, user);
    },
    memberships: async (parent, _, { getAbilities, user, dataLoader }, info) => {
        const abilities = await getAbilities();

        if (abilities.canReadUserSensitiveData(parent) || abilities.canManageUsers()) {
            return dataLoader.tenantMembershipByUserId.load(parent._id).then(tenants =>
                tenants.map(tenant => ({
                    ...tenant.membership,
                    tenant,
                }))
            );
        }

        return throwPermissionDenied(info, user);
    },
};

export default resolver;
