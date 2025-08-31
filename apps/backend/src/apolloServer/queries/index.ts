import type { GqlQueryResolvers } from '../resolver-types.js';
import * as auth from './auth/index.js';
import * as system from './system/index.js';
import * as tenants from './tenants/index.js';

const resolvers: GqlQueryResolvers = {
    ...auth,
    ...system,
    ...tenants,
    noop: () => false,
};

export default resolvers;
