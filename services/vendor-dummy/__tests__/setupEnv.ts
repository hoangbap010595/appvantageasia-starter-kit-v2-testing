import { URL } from 'node:url';
import { loadEnvironment } from '@appvantageasia/devtools';

const env = loadEnvironment(process.cwd(), 'test', false).combinedEnv;
const workerId = parseInt(process.env.VITEST_POOL_ID!, 10);
const redisConnectionUrl = new URL(env!.APP_BULL_REDIS_URI || env!.APP_REDIS_URI);
const redisDatabase = parseInt(redisConnectionUrl.pathname.replace('/', ''), 10) + workerId - 1;
redisConnectionUrl.pathname = `/${redisDatabase}`;

process.env.APP_BULL_REDIS_URI = redisConnectionUrl.toString();
process.env.APP_DB_NAME = `${env!.APP_DB_NAME}-${workerId}`;
