import type { Migration } from '@appvantageasia/core-database';

const migration: Migration = {
    identifier: '01_createInitialUserIndexes',
    up: async ({ db }) => {
        await db.collection('user_identities').createIndex({ email: 1 }, { unique: true });
        await db.collection('user_sessions').createIndex({ userId: 1 });
    },
};

export default migration;
