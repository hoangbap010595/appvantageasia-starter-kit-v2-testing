import type { TenantMembershipRole, TenantDocument } from '@appvantageasia/core-tenants';
import { getCollections as getTenantCollections } from '@appvantageasia/core-tenants';
import { getCollections as getUserCollections } from '@appvantageasia/core-users';

const addMembership = async (tenantE2eId: string, userE2eId: string, role: TenantMembershipRole) => {
    const { tenants } = await getTenantCollections();
    const { users } = await getUserCollections();

    const user = await users.findOne({ __e2e__: { id: userE2eId } });

    if (!user) {
        throw new Error(`User with e2eId ${userE2eId} not found`);
    }

    const entry: TenantDocument['users'][number] = {
        userId: user._id,
        role,
    };

    const result = await tenants.updateOne({ __e2e__: { id: tenantE2eId } }, { $push: { users: entry } });

    if (!result.modifiedCount) {
        throw new Error(`Tenant with e2eId ${tenantE2eId} not found`);
    }
};

export default addMembership;
