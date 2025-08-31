import type { GqlMutationResolvers } from '../resolver-types.js';
import * as auth from './auth/index.js';
import * as system from './system/index.js';

const resolvers: GqlMutationResolvers = {
    ...auth,
    ...system,
    noop: () => false,
};

export default resolvers;
