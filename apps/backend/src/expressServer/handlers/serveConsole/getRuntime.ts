import type { Request } from 'express';
import * as config from '../../../config.js';
import getSSO from '../../../utils/getSSO.js';
import { type ConsoleSessionState, createConsoleSession } from './consoleSession.js';

export interface Runtime {
    hostname: string;
    environment: string;
    sentryDsn: string;
    sentryRelease?: string;
    sampleRate: number;
    useTracing: boolean;
    useProfiling: boolean;
    appVersion: string;
    translationsSink: string;
    useReplay: boolean;
    replaySampleRate: number;
    tracingSampleRate: number;
    apolloDevToolsEnabled: boolean;
    session: ConsoleSessionState;
    sso: Awaited<ReturnType<typeof getSSO>>;
}

const getRuntime = async (request: Request): Promise<Runtime> => {
    return {
        hostname: request.hostname,
        sampleRate: config.sentrySampleRate,
        replaySampleRate: config.sentryReplaySampleRate,
        sentryDsn: config.sentryDsn,
        useReplay: config.useReplay,
        useTracing: config.useTracing,
        useProfiling: config.useProfiling,
        environment: config.environment,
        sentryRelease: config.sentryRelease,
        tracingSampleRate: config.sentryProfilingRate,
        appVersion: config.appVersion,
        translationsSink: config.spaConsoleCdn || `${request.protocol}://${request.get('host')}/public`,
        apolloDevToolsEnabled: config.spaApolloDevToolsEnabled,
        session: createConsoleSession(),
        sso: await getSSO(),
    };
};

export default getRuntime;
