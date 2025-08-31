import { env } from '@appvantageasia/core-node-utils';

const { getString, getBoolean } = env;
const getEnvKey = env.getEnvKey.addPostPrefix('AWS');

export const isCustomized = getBoolean(getEnvKey('CUSTOMIZED'), false);
export const key = getString(getEnvKey('ACCESS_KEY_ID'));
export const secret = getString(getEnvKey('SECRET_ACCESS_KEY'));
