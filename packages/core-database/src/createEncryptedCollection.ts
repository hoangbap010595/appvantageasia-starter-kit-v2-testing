import type { Document, ClientEncryption } from 'mongodb';
import * as config from './config.js';
import type { DatabaseClient } from './getDatabaseClient.js';
import getDatabaseClient from './getDatabaseClient.js';

type Options = Parameters<ClientEncryption['createEncryptedCollection']>[2];

const getOptions = (createCollectionOptions: Options['createCollectionOptions']): Options => {
    switch (config.encryptionMode) {
        case 'local':
            return {
                provider: 'local',
                createCollectionOptions,
            };

        case 'aws':
            if (!config.encryptionAwsKeyArn) {
                throw new Error('AWS key ARN is required for AWS encryption');
            }

            if (!config.awsRegion) {
                throw new Error('AWS region is required for AWS encryption');
            }

            return {
                provider: 'aws',
                createCollectionOptions,
                masterKey: {
                    key: config.encryptionAwsKeyArn,
                    region: config.awsRegion,
                },
            };

        default:
            throw new Error('Encryption mode is not supported');
    }
};

const createEncryptedCollection = async <TSchema extends Document = Document>(
    collectionName: string,
    createCollectionOptions: Options['createCollectionOptions'],
    context?: DatabaseClient
) => {
    const { client, clientEncryption, encryptedClient } = context || (await getDatabaseClient());

    if (!clientEncryption || !encryptedClient) {
        return client.db(config.databaseName).collection<TSchema>(collectionName);
    }

    const { collection } = await clientEncryption.createEncryptedCollection<TSchema>(
        encryptedClient.db(config.databaseName),
        collectionName,
        getOptions(createCollectionOptions)
    );

    return collection;
};

export default createEncryptedCollection;
