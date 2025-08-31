import { env } from '@appvantageasia/core-node-utils';
import type { AuthMechanism } from 'mongodb';

const { getString, getInteger, getBoolean, getStringListFromSpace } = env;
const getEnvKey = env.getEnvKey.addPostPrefix('DB');

export const databaseUri = getString(getEnvKey('URI'), 'mongodb+srv://localhost:27017');
export const databaseName = getString(getEnvKey('NAME'), 'app');
export const poolSize = getInteger(getEnvKey('POOL'), 10);
export const authMechanism = getString(getEnvKey('AUTH_MECHANISM'), 'DEFAULT') as AuthMechanism;

export const cryptdUri = getString(getEnvKey('CRYPTD_URI'));
export const cryptdBypassSpawn = getBoolean(getEnvKey('CRYPTD_BYPASS_SPAWN'), false);
export const cryptdSpawnArgs = getStringListFromSpace(getEnvKey('CRYPTD_SPWAN_ARGS'), []);

export const encryptionMode = getString(getEnvKey('ENCRYPTION_MODE'), 'none').toLowerCase();
export const encryptionKeyVaultDatabaseName = getString(getEnvKey('ENCRYPTION_KEY_VAULT_NAME'), 'encryption');
export const encryptionKeyVaultCollectionName = getString(
    getEnvKey('ENCRYPTION_KEY_VAULT_COLLECTION_NAME'),
    '__keyVault'
);
export const encryptionModeKeyVaultNamespace = `${encryptionKeyVaultDatabaseName}.${encryptionKeyVaultCollectionName}`;

// master key path if encryption is "local"
export const encryptionMasterKey = getString(getEnvKey('MASTER_KEY'));

// aws credentials if encryption is "aws"
export const encryptionAwsKeyArn = getString(getEnvKey('AWS_KEY_ARN'));
export const awsRegion = getString(getEnvKey('AWS_REGION'));
