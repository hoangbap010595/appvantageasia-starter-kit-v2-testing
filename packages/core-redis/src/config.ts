import { env } from '@appvantageasia/core-node-utils';

const { getString } = env;
const getEnvKey = env.getEnvKey.addPostPrefix('REDIS');

// todo remove eslint disabled rule once we have more settings here
// eslint-disable-next-line import/prefer-default-export
export const redisUri = getString(getEnvKey('URI'), 'redis://localhost:6379/0');
