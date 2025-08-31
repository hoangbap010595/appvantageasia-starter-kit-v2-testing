import { env } from '@appvantageasia/core-node-utils';
import { config } from '@appvantageasia/core-redis';

const { getString, getInteger } = env;
const getEnvKey = env.getEnvKey.addPostPrefix('BULL');

export const redisUri = getString(getEnvKey('REDIS_URI'), config.redisUri);

export const queueName = getString(getEnvKey('QUEUE_NAME'), 'default');

// retentions in days
export const jobRetention = getInteger(getEnvKey('JOB_RETENTION'), 30);

export const cleanUpJobInterval = getInteger(getEnvKey('CLEAN_UP_JOB_INTERVAL'));
export const cleanUpJobCron = getString(getEnvKey('CLEAN_UP_JOB_CRON'), '0 0 * * *');
