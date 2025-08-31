import { env } from '@appvantageasia/core-node-utils';

const { getString, getBoolean } = env;
const getEnvKey = env.getEnvKey.addPostPrefix('STORAGE');

export const useAwsCredentials = getBoolean(getEnvKey('AWS_IDENTITY'), true);

export const accessKey = getString(getEnvKey('ACCESS_KEY'));

export const secretKey = getString(getEnvKey('SECRET_KEY'));

export const region = getString(getEnvKey('REGION'), 'ap-southeast-1');

export const endpoint = getString(getEnvKey('ENDPOINT'), `https://s3.${region}.amazonaws.com`);

export const bucket = getString(getEnvKey('BUCKET'), 'starter-kit-v2');

export const forcePathStyle = getBoolean(getEnvKey('FORCE_PATH_STYLE'), false);
