import type { GqlSsoConfigurationResolvers } from '../resolver-types.js';

const resolver: GqlSsoConfigurationResolvers = {
    __resolveType: root => root.__type,
};

export default resolver;
