import { readFileSync } from 'node:fs';
import type { AutoEncryptionOptions } from 'mongodb';
import * as config from './config.js';

type Options = NonNullable<AutoEncryptionOptions['kmsProviders']>;

export const getLocalMasterKey = () => {
    if (!config.encryptionMasterKey) {
        throw new Error('Master key path is required for local encryption');
    }

    return readFileSync(config.encryptionMasterKey);
};

const getKMS = async (): Promise<{
    provider: keyof Options;
    kmsProviders: Options;
    keyVaultNamespace: string;
} | null> => {
    switch (config.encryptionMode) {
        case 'local':
            return {
                provider: 'local',
                kmsProviders: { local: { key: getLocalMasterKey() } },
                keyVaultNamespace: config.encryptionModeKeyVaultNamespace,
            };

        case 'aws': {
            return {
                provider: 'aws',
                kmsProviders: {
                    aws: {
                        /* empty object means we use credentials from the environment */
                    },
                },
                keyVaultNamespace: config.encryptionModeKeyVaultNamespace,
            };
        }

        default:
            return null;
    }
};

export default getKMS;
