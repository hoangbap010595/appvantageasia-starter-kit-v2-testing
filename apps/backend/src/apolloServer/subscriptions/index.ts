import type { GqlSubscriptionResolvers } from '../resolver-types.js';
import eventFromConsoleSession from './eventFromConsoleSession.js';
import eventFromUserSession from './eventFromUserSession.js';

const resolvers: GqlSubscriptionResolvers = {
    eventFromUserSession,
    eventFromConsoleSession,
};

export default resolvers;
