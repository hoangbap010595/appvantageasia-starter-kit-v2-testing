import type { MongoClientOptions } from 'mongodb';
import { MongoClient, ServerApiVersion } from 'mongodb';
import * as config from './config.js';

export const getRegularOptions = async (): Promise<MongoClientOptions> => {
    const options: MongoClientOptions = {
        maxPoolSize: config.poolSize,
        serverApi: {
            version: ServerApiVersion.v1,
            deprecationErrors: true,
        },
    };

    switch (config.authMechanism) {
        case 'MONGODB-AWS':
            return {
                ...options,
                authSource: '$external',
                authMechanism: 'MONGODB-AWS',
            };

        case 'DEFAULT':
            return options;

        default:
            throw new Error(`Unsupported auth mechanism: ${config.authMechanism}`);
    }
};

const getRegularClient = async () => MongoClient.connect(config.databaseUri, await getRegularOptions());

export default getRegularClient;
