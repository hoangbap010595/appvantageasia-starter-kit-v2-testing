import { env } from '@appvantageasia/core-utils';

const { getString } = env;

export const protocol = getString(env.getEnvKey('SERVER_PROTOCOL'), 'http');
export const hostname = getString(env.getEnvKey('SERVER_HOSTNAME'), 'localhost');

// add prefix to all env variables
export const getEnvKey = env.getEnvKey.addPostPrefix('EMAIL');

// look for next env variable which are used when using react-emails
// if that happens we forcefully set SPA_CONSOLE_CDN to something else
const isNextRuntime = !!process.env.NEXT_PUBLIC_USER_PROJECT_LOCATION;

export const spaConsoleCdn = isNextRuntime ? '/static/' : getString(env.getEnvKey('SPA_CONSOLE_CDN'), '');

/* settings */
export const sender = getString(getEnvKey('SENDER'), 'noreply@appvantage.co');
export const transporter = getString(getEnvKey('TRANSPORTER'), 'SMTP');

// the system application name.
export const appName = getString(getEnvKey('APP_NAME'), 'Starter Kit');
