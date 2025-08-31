import { env } from '@appvantageasia/core-node-utils';

const { getEnvKey, getString } = env;

export const protocol = getString(getEnvKey('SERVER_PROTOCOL'), 'http');

export const hostname = getString(getEnvKey('SERVER_HOSTNAME'), 'localhost');
