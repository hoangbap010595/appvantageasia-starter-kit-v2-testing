import getOIDCCallback from '../../utils/getOIDCCallback.js';
import type { GqlOidcConfigurationResolvers } from '../resolver-types.js';

const resolver: GqlOidcConfigurationResolvers = {
    callback: () => getOIDCCallback(),
};

export default resolver;
