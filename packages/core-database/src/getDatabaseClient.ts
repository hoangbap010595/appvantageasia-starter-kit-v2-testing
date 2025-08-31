/// <reference path="../types/global.d.ts" />
import type { MongoClient, Db, ClientEncryption } from 'mongodb';
import * as config from './config.js';
import getEncryptedClient from './getEncryptedClient.js';
import getRegularClient from './getRegularClient.js';

export interface DatabaseClient {
    client: MongoClient;
    encryptedClient?: MongoClient;
    clientEncryption?: ClientEncryption;
    db: Db;
}

export const closeConnections = async (force = true) => {
    if (!global.mongo) {
        return;
    }

    const context = global.mongo.promise ? await global.mongo.promise : global.mongo.value;

    if (!context) {
        return;
    }

    await context.client.close(force);

    if (context.encryptedClient && context.encryptedClient !== context.client) {
        await context.encryptedClient.close(force);
    }

    global.mongo.value = null;
};

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

const getDatabaseClient = async (): Promise<DatabaseClient> => {
    if (!global.mongo) {
        // update the global store
        global.mongo = { value: null, promise: null };
    }

    if (global.mongo.value) {
        return global.mongo.value;
    }

    if (!global.mongo.promise) {
        const init = async (): Promise<DatabaseClient> => {
            // get regular client first
            const client = await getRegularClient();
            const db = client.db(config.databaseName);
            const encryption = await getEncryptedClient();

            if (!encryption) {
                return { client, db };
            }

            return {
                client,
                db,
                // add encryption clients
                encryptedClient: encryption.client,
                clientEncryption: encryption.clientEncryption,
            };
        };

        // get the promise
        global.mongo.promise = init();
    }

    // wait for it
    // and assigned it globally
    global.mongo.value = await global.mongo.promise;
    global.mongo.promise = null;

    // finally return the cache
    return global.mongo.value;
};

export default getDatabaseClient;
