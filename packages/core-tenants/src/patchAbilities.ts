import type { UserDocument } from '@appvantageasia/core-users';
import type { AbilityBuilder, MongoAbility } from '@casl/ability';
import getCollections, { TenantMembershipRole } from './getCollections.js';

const patchAbilities = async (abilityBuilder: AbilityBuilder<MongoAbility>, user?: UserDocument) => {
    const { can } = abilityBuilder;

    if (user) {
        const { tenants } = await getCollections();
        const userTenants = tenants.find({ 'users.userId': user._id });

        for await (const tenant of userTenants) {
            const relation = tenant.users.find(membership => membership.userId.equals(user._id));

            if (!relation) {
                // that is not expected but we implement it to handle it and make TS happy
                continue;
            }

            can(['read'], 'Tenant', { _id: tenant._id });

            if (relation.role === TenantMembershipRole.Admin) {
                can(['manage'], 'Tenant', { _id: tenant._id });
            }
        }
    }
};

export default patchAbilities;
