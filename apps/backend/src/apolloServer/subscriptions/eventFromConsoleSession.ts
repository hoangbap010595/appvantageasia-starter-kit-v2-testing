import { pubSub } from '@appvantageasia/core-pubsub';
import { verifyConsoleSession } from '../../expressServer/handlers/serveConsole/consoleSession.js';
import { type GqlSubscriptionResolvers } from '../resolver-types.js';

const resolver: GqlSubscriptionResolvers['eventFromConsoleSession'] = {
    subscribe: async (root, { token }) => {
        const nonce = verifyConsoleSession(token);

        if (!nonce) {
            // todo
            throw new Error('Invalid session');
        }

        return pubSub.asyncIterator(`pubSub.consoleSession.${nonce}.*`, {
            pattern: true,
        }) as unknown as AsyncIterable<any>;
    },
};

export default resolver;
