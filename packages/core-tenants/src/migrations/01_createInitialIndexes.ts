import type { Migration } from '@appvantageasia/core-database';

const migration: Migration = {
    identifier: '01_createInitialTenantIndexes',
    up: async ({ db }) => {
        await db.collection('tenants_instances').createIndex({ 'users.userId': 1 });
        await db.collection('tenant_instances').createIndex({ slug: 1 }, { unique: true });
    },
};

export default migration;
