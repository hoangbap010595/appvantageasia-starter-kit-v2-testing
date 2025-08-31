import type { ClientEncryptionOptions, MongoClientOptions } from 'mongodb';
import { ClientEncryption, MongoClient } from 'mongodb';
import * as config from './config.js';
import getKMS from './getKMS.js';
import { getRegularOptions } from './getRegularClient.js';

export const getEncryptedOptions = async (
    kms: Exclude<Awaited<ReturnType<typeof getKMS>>, null>
): Promise<MongoClientOptions> => ({
    ...(await getRegularOptions()),

    autoEncryption: {
        keyVaultNamespace: kms.keyVaultNamespace,
        kmsProviders: kms.kmsProviders,

        // configure cryptd client
        extraOptions: {
            mongocryptdURI: config.cryptdUri,
            mongocryptdBypassSpawn: config.cryptdBypassSpawn,
            mongocryptdSpawnArgs: config.cryptdSpawnArgs,
        },
    },
});

const getEncryptedClient = async () => {
    const kms = await getKMS();

    if (!kms) {
        return Promise.resolve(null);
    }

    const options = await getEncryptedOptions(kms);

    if (!options.autoEncryption) {
        throw new Error('Auto encryption options are required');
    }

    const client = await MongoClient.connect(config.databaseUri, options);

    return {
        client,
        clientEncryption: new ClientEncryption(client, options.autoEncryption as ClientEncryptionOptions),
    };
};

export default getEncryptedClient;
