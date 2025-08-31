import { env } from '@appvantageasia/core-node-utils';

const { getInteger, getString, getStringListFromComma } = env;
const getEnvKey = env.getEnvKey.addPostPrefix('AUTH');

export const localSalt = getInteger(getEnvKey('LOCAL_SALT'), 10);
export const localPreviousPasswords = getInteger(getEnvKey('LOCAL_PAST_PWDS'), 5);
export const localMinimumLength = getInteger(getEnvKey('LOCAL_MIN_LENGTH'), 14);
export const localPasswordDuration = getInteger(getEnvKey('LOCAL_DURATION'), 90);

export const msalCloudInstance = getString(getEnvKey('MSAL_INSTANCE', 'https://login.microsoftonline.com/'));
export const msalTenantId = getString(getEnvKey('MSAL_TENANT_ID'));
export const msalClientId = getString(getEnvKey('MSAL_CLIENT_ID'));
export const msalClientSecret = getString(getEnvKey('MSAL_CLIENT_SECRET'));
export const msalGraphEndpoint = getString(getEnvKey('MSAL_GRAPH_ENDPOINT', 'https://graph.microsoft.com/v1.0/'));

export const passKeyRpName = getString(getEnvKey('PASSKEY_RP_NAME'), 'Appvantage Asia');
export const passKeyRpId = getString(getEnvKey('PASSKEY_RP_ID'), 'appvantageasia.com');
export const passKeyOrigin = getStringListFromComma(getEnvKey('PASSKEY_ORIGIN'), [`https://${passKeyRpId}`]);
