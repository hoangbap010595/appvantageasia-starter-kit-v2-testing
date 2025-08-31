import { type TenantDocument, type TenantMembership, getCollections } from '@appvantageasia/core-tenants';
import type DataLoader from 'dataloader';
import type { ObjectId } from 'mongodb';
import { buildOneToOneLoader, buildOneToManyLoader } from '../helper.js';

type TenantWithMembership = TenantDocument & { membership: TenantMembership };

export interface TenantLoaders {
    tenantById: DataLoader<ObjectId, TenantDocument>;
    tenantMembershipByUserId: DataLoader<ObjectId, TenantWithMembership[]>;
}

const createTenantLoaders = (): TenantLoaders => {
    const tenantById = buildOneToOneLoader<TenantDocument>(keys =>
        getCollections().then(({ tenants }) => tenants.find({ _id: { $in: keys } }).toArray())
    );

    const tenantMembershipByUserId = buildOneToManyLoader<TenantWithMembership>(
        keys =>
            getCollections().then(({ tenants }) => {
                return tenants
                    .find({ userId: { $in: keys } })
                    .toArray()
                    .then(tenants =>
                        tenants.flatMap(tenant => tenant.users.map(membership => ({ ...tenant, membership })))
                    );
            }),
        tenant => tenant.membership.userId.toHexString()
    );

    return { tenantById, tenantMembershipByUserId };
};

export default createTenantLoaders;
