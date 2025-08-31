import { getDatabaseClient } from '@appvantageasia/core-database';
import attachOTP from '../generators/attachOTP.js';
import createUser from '../generators/createUser.js';
import type { Snapshot } from '../generators/types.js';

export const dependencies: Snapshot['dependencies'] = [];

export const execute: Snapshot['execute'] = async () => {
    const { db } = await getDatabaseClient();
    const collection = db.collection('user_identities');

    const simpleUser = await createUser('simple-user');
    await collection.insertOne(simpleUser);

    const simpleAdmin = await createUser('simple-admin');
    await collection.insertOne(simpleAdmin);

    const otpUser = await createUser('otp-user').then(attachOTP);
    await collection.insertOne(otpUser);

    const superAdmin = await createUser('super-admin');
    superAdmin.isSuperAdmin = true;
    await collection.insertOne(superAdmin);
};
