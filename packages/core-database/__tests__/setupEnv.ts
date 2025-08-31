import { loadEnvironment } from '@appvantageasia/devtools';

const env = loadEnvironment(process.cwd(), 'test', false).combinedEnv;
const workerId = parseInt(process.env.VITEST_POOL_ID!, 10);
process.env.APP_DB_NAME = `${env!.APP_DB_NAME}-${workerId}`;
