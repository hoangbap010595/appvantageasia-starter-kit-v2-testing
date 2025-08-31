import * as Sentry from '@sentry/node';
import isEmpty from 'lodash/fp/isEmpty.js';
import type { Context, ServiceBroker } from 'moleculer';

type SentryTrace = Pick<ReturnType<typeof Sentry.getTraceData>, 'sentry-trace' | 'baggage'>;

// create a function to invoke to call a broker action
// it will forward Sentry tracing through meta data on the action context
// for it to be properly forwarded, the action implementation must use wrapAction function
export const wrapInterface = <Args, ReturnType>(broker: ServiceBroker, actionName: string) => {
    return (args: Args) => {
        const traceData = Sentry.getTraceData();

        if (!isEmpty(traceData)) {
            const sentryTraceData: SentryTrace = {
                'sentry-trace': traceData['sentry-trace'],
                baggage: traceData['baggage'],
            };

            return broker.call<ReturnType, Args>(actionName, args, { meta: { sentryTraceData } });
        }

        return broker.call<ReturnType, Args>(actionName, args);
    };
};

// wrap a function for moleculer action implementations
// it will retrieved sentry tracing from the action context meta data
// if not provided, it will instead start a new trace
export const wrapAction = <Args, ReturnType>(action: (context: Context<Args>) => Promise<ReturnType>) => {
    return (context: Context<Args, { sentryTraceData?: SentryTrace }>): Promise<ReturnType> => {
        const sentryTraceData = context.meta?.sentryTraceData;

        const execute = () =>
            Sentry.startSpan(
                { op: 'bull', name: `${context.action?.service?.name}.${context.action?.name}` },
                async () => action(context)
            );

        if (sentryTraceData) {
            const sentryTrace = sentryTraceData['sentry-trace'];
            const baggage = sentryTraceData.baggage;

            return Sentry.continueTrace({ sentryTrace, baggage }, execute);
        }

        return Sentry.startNewTrace(execute);
    };
};
