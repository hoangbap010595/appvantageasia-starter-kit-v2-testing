import type { GqlTenantMembershipResolvers } from '../resolver-types.js';
import throwPermissionDenied from '../throwPermissionDenied.js';

const resolver: GqlTenantMembershipResolvers = {
    tenant: async (root, _, { getAbilities, user }, info) => {
        const abilities = await getAbilities();

        if (abilities.canReadTenant(root.tenant)) {
            return root.tenant;
        }

        return throwPermissionDenied(info, user);
    },
    role: async (root, _, { getAbilities, user }, info) => {
        const abilities = await getAbilities();

        if (abilities.canManageTenant(root.tenant) || (user && root.userId.equals(user._id))) {
            return root.role;
        }

        return throwPermissionDenied(info, user);
    },
};

export default resolver;
