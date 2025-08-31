import { pubSub } from '@appvantageasia/core-pubsub';
import { validateSession } from '../../expressServer/session.js';
import { type GqlSubscriptionResolvers } from '../resolver-types.js';

const resolver: GqlSubscriptionResolvers['eventFromUserSession'] = {
    subscribe: async (root, { token }) => {
        const session = await validateSession(token);

        if (!session) {
            // todo
            throw new Error('Invalid session');
        }

        return pubSub.asyncIterator(`pubSub.userSession.${session.userId}.${session._id}.*`, {
            pattern: true,
        }) as unknown as AsyncIterable<any>;
    },
};

export default resolver;
