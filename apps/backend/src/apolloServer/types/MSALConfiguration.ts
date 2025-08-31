import getMSALCallback from '../../utils/getMSALCallback.js';
import type { GqlMsalConfigurationResolvers } from '../resolver-types.js';

const resolver: GqlMsalConfigurationResolvers = {
    callback: () => getMSALCallback(),
};

export default resolver;
