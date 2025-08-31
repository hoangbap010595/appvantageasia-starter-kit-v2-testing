import { getDatabaseClient } from '@appvantageasia/core-database';
import { TenantMembershipRole } from '@appvantageasia/core-tenants';
import addMembership from '../generators/addMembership.js';
import createTenants from '../generators/createTenants.js';
import type { Snapshot } from '../generators/types.js';

export const dependencies: Snapshot['dependencies'] = ['baseUsers'];

export const execute: Snapshot['execute'] = async () => {
    const { db } = await getDatabaseClient();
    const collection = db.collection('tenants_instances');

    const tenantA = await createTenants('tenant-a');
    await collection.insertOne(tenantA);
    await addMembership('tenant-a', 'simple-admin', TenantMembershipRole.Admin);
    await addMembership('tenant-a', 'simple-user', TenantMembershipRole.User);

    const tenantB = await createTenants('tenant-b');
    await collection.insertOne(tenantB);
    await addMembership('tenant-b', 'simple-admin', TenantMembershipRole.Admin);
};
