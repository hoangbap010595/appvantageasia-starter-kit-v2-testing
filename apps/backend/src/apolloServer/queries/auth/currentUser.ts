import type { GqlQueryResolvers } from '../../resolver-types.js';

const resolver: GqlQueryResolvers['currentUser'] = async (root, args, context) => context.user;

export default resolver;
