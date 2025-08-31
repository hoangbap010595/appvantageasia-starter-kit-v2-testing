import { env } from '@appvantageasia/core-node-utils';
import { config } from '@appvantageasia/core-redis';

const { getString } = env;
const getEnvKey = env.getEnvKey.addPostPrefix('BROKER');

export const transporterUri = getString(getEnvKey('TRANSPORTER_URI'), config.redisUri);

export const namespace = getString(getEnvKey('NAMESPACE'), 'starter-kit-v2');

export const logLevel = getString(getEnvKey('LOG_LEVEL'), 'info');
