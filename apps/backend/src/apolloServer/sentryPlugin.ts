import type { ApolloServerPlugin } from '@apollo/server';
import * as Sentry from '@sentry/node';
import type { Context } from './mapped-types.js';

const sentryPlugin: ApolloServerPlugin<Context> = {
    async requestDidStart() {
        return {
            async didEncounterErrors(requestContext) {
                // If we couldn't parse the operation, don't do anything here
                if (!requestContext.operation) {
                    return;
                }

                for (const error of requestContext.errors) {
                    // Add scoped report details and send to Sentry
                    Sentry.withScope(scope => {
                        // annotate whether failing operation was query/mutation/subscription
                        scope.setTag('kind', requestContext.operation!.operation);

                        // log query and variables as extras
                        scope.setExtra('query', requestContext.request.query);
                        scope.setExtra('variables', requestContext.request.variables);

                        if (error.path) {
                            // We can also add the path as breadcrumb
                            scope.addBreadcrumb({
                                category: 'query-path',
                                message: error.path.join(' > '),
                                level: 'debug',
                            });
                        }

                        Sentry.captureException(error);
                    });
                }
            },
        };
    },
};

export default sentryPlugin;
