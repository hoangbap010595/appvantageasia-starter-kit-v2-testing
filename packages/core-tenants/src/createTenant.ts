import type { UserDocument } from '@appvantageasia/core-users';
import { ObjectId } from 'mongodb';
import getCollections, { type TenantDocument, TenantMembershipRole } from './getCollections.js';

const createTenant = async (baseInformation: Pick<TenantDocument, 'name' | 'slug'>, user: UserDocument) => {
    const tenant: TenantDocument = {
        _id: new ObjectId(),
        ...baseInformation,
        users: [{ userId: user._id, role: TenantMembershipRole.Admin }],
        _caslType: 'Tenant',
    };

    const { tenants } = await getCollections();
    await tenants.insertOne(tenant);

    return tenant;
};

export default createTenant;
