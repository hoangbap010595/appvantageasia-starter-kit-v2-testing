import { extendSession } from '../../../expressServer/session.js';
import TrailWithGql from '../../TrailWithGql.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';

const resolver: GqlMutationResolvers['extendSession'] = async (root, args, context, info) => {
    if (!context.session) {
        await new TrailWithGql().info().graphql(info).eventType('FAILED_SESSION_EXTENSION').save();
        throw new Error('Not authenticated');
    }

    const { token } = await extendSession(context.session._id);
    await new TrailWithGql().info().user(context.user!).graphql(info).save();

    return token;
};

export default resolver;
