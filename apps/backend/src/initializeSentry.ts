import { print } from '@appvantageasia/core-node-utils';
import * as Sentry from '@sentry/node';
import * as config from './config.js';

const nodeProfilingIntegration = await (async () => {
    try {
        const { nodeProfilingIntegration: integration } = await import('@sentry/profiling-node');

        return integration;
    } catch {
        print.error('Node profiling could not be loaded');
    }

    return null;
})();

export interface InitializeSentryArgs {
    withExpressServer?: boolean;
}

const initializeSentry = (context: InitializeSentryArgs = {}) => {
    const integrations: Sentry.NodeOptions['integrations'] = [
        // Sentry.rewriteFramesIntegration(),
        Sentry.anrIntegration({ captureStackTrace: true }),
    ];

    const sentryInitOptions: Sentry.NodeOptions = {
        release: config.sentryRelease,
        dsn: config.sentryDsn,
        environment: config.environment,
        maxValueLength: Infinity,
        normalizeDepth: 4,
    };

    if (config.useSentryDebug) {
        sentryInitOptions.debug = true;
    }

    if (config.useTracing || config.useProfiling) {
        sentryInitOptions.tracesSampleRate = config.sentrySampleRate;

        if (context.withExpressServer) {
            integrations.push(Sentry.httpIntegration());
            integrations.push(Sentry.expressIntegration());
            integrations.push(Sentry.graphqlIntegration());
        }

        integrations.push(Sentry.redisIntegration());
        integrations.push(Sentry.mongoIntegration());
    }

    if (config.useProfiling) {
        sentryInitOptions.tracesSampleRate = config.sentryProfilingRate;
        sentryInitOptions.profilesSampleRate = config.sentryProfilingRate;

        if (nodeProfilingIntegration) {
            integrations.push(nodeProfilingIntegration());
        }
    }

    sentryInitOptions.integrations = integrations;

    const proxy = config.httpProxy || config.httpProxy;
    if (proxy) {
        sentryInitOptions.transportOptions = { proxy };
    }

    Sentry.init(sentryInitOptions);
};

export default initializeSentry;
