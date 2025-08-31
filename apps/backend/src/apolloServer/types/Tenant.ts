import type { GqlTenantResolvers } from '../resolver-types.js';
import throwPermissionDenied from '../throwPermissionDenied.js';

const resolver: GqlTenantResolvers = {
    id: parent => parent._id,
    users: async (root, _, { getAbilities, user }, info) => {
        const abilities = await getAbilities();

        if (abilities.canReadTenant(root)) {
            return root.users.map(membership => ({ ...membership, tenant: root }));
        }

        return throwPermissionDenied(info, user);
    },
};

export default resolver;
