import { join } from 'node:path';
import { print, env } from '@appvantageasia/core-node-utils';

const { getNumber, getEnvKey, getString, getInteger, getBoolean } = env;

const throwOnUndefined = <Value>(value: Value | undefined, message: string): Value => {
    if (!value) {
        throw new Error(message);
    }

    return value;
};

export const protocol = getString(getEnvKey('SERVER_PROTOCOL'), 'http');
export const hostname = getString(getEnvKey('SERVER_HOSTNAME'), 'localhost');
export const port = getInteger(getEnvKey('SERVER_PORT'), 3000);
export const host = getString(getEnvKey('SERVER_HOST'), '0.0.0.0');

export const useCompression = getBoolean(getEnvKey('SERVER_GZIP'), true);
export const serveStatic = getBoolean(getEnvKey('SERVER_SERVE_STATIC'), true);
export const staticDirectory = getString(getEnvKey('SERVER_STATIC_DIRECTORY'), join(process.cwd(), './public'));

export const jsonLimit = getString(getEnvKey('SERVER_JSON_LIMIT'), '1MB');

export const sentryDsn = getString(getEnvKey('SENTRY_DSN'), '');
export const useTracing = getBoolean(getEnvKey('SENTRY_TRACING'), true);
export const useProfiling = getBoolean(getEnvKey('SENTRY_PROFILING'), false);
export const sentrySampleRate = getInteger(getEnvKey('SENTRY_SAMPLE_RATE'), 1.0);
export const sentryRelease = getString(getEnvKey('SENTRY_RELEASE'));
export const useReplay = getBoolean(getEnvKey('SENTRY_REPLAY'), false);
export const sentryReplaySampleRate = getInteger(getEnvKey('SENTRY_REPLAY_SAMPLE_RATE'), 1.0);
export const useSentryDebug = getBoolean(getEnvKey('SENTRY_DEBUG'), false);
export const sentryProfilingRate = getInteger(getEnvKey('SENTRY_PROFILING_SAMPLE_RATE'), 1.0);

export const sessionSecret = throwOnUndefined(getString(getEnvKey('SESSION_SECRET')), 'JWT Secret is required');
export const sessionExpiresIn = getNumber(getEnvKey('SESSION_EXPIRES_IN'), 3600);

export const environment = getString(getEnvKey('ENVIRONMENT'), 'unknown');
export const appVersion = getString(getEnvKey('VERSION'), '0.0.0-development.0');

export const spaApolloDevToolsEnabled = getBoolean(getEnvKey('SPA_APOLLO_DEV_TOOLS'), false);
export const spaConsoleCdn = getString(getEnvKey('SPA_CONSOLE_CDN'), '');
export const spaConsoleManifest = getString(
    getEnvKey('SPA_CONSOLE_MANIFEST'),
    join(process.cwd(), './consoleManifest.json')
);

export const healthMonitorEnabled = getBoolean(getEnvKey('HEALTH_MONITOR_ENABLED'), true);
export const healthMonitorHost = getString(getEnvKey('HEALTH_MONITOR_HOST'), '0.0.0.0');
export const healthMonitorPort = getInteger(getEnvKey('HEALTH_MONITOR_PORT'), 50051);
export const healthMonitorInterval = getInteger(getEnvKey('HEALTH_MONITOR_INTERVAL'), 1000);
// verbosity may be set to 0, 1 or 2, the higher it is, the more verbose it is
export const healthMonitorVerbose = getInteger(getEnvKey('HEALTH_MONITOR_VERBOSE'), 0);

// bull board may be use for development or debugging tools
// it will be served on `/.bullBoard` endpoint
export const useBullBoard = getBoolean(getEnvKey('USE_BULL_BOARD'), false);

export const usePrometheusExport = getBoolean(getEnvKey('USE_PROMETHEUS_EXPORT'), false);
export const prometheusExportHost = getString(getEnvKey('PROMETHEUS_EXPORT_HOST'), '0.0.0.0');
export const prometheusExportPort = getInteger(getEnvKey('PROMETHEUS_EXPORT_PORT'), 9090);

export const httpProxy = getString('HTTP_PROXY');
export const httpsProxy = getString('HTTPS_PROXY');

export const withCoverage = !!process.env.NODE_V8_COVERAGE;

if (withCoverage) {
    print.warn('Coverage is enabled with C8');
}
