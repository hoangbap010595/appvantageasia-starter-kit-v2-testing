import * as Sentry from '@sentry/react';
import React from 'react';
import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router';
import runtime from './runtime';

const integrations: Sentry.BrowserOptions['integrations'] = [
    Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
    }),
];

const sentryInitOptions: Sentry.BrowserOptions = {
    release: runtime.sentryRelease,
    dsn: runtime.sentryDsn,
    environment: runtime.environment,
};

if (runtime.useTracing) {
    sentryInitOptions.tracesSampleRate = runtime.sampleRate;
}

if (runtime.useProfiling) {
    sentryInitOptions.tracesSampleRate = runtime.tracingSampleRate;
    sentryInitOptions.profilesSampleRate = runtime.tracingSampleRate;
}

if (runtime.useReplay) {
    integrations.push(
        Sentry.replayIntegration({
            maskAllInputs: true,
            maskAllText: false,
        })
    );

    sentryInitOptions.replaysSessionSampleRate = runtime.replaySampleRate;
    sentryInitOptions.replaysOnErrorSampleRate = 1.0;
}

sentryInitOptions.integrations = integrations;

Sentry.init(sentryInitOptions);
