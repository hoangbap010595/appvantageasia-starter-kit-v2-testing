import { msalAuthentication } from '@appvantageasia/core-users';
import getMSALCallback from '../../../utils/getMSALCallback.js';
import type { GqlQueryResolvers } from '../../resolver-types.js';

const resolver: GqlQueryResolvers['MSALUrl'] = async () => {
    const msalConfig = await msalAuthentication.getConfig();

    if (!msalConfig) {
        return null;
    }

    const callback = getMSALCallback();

    return msalAuthentication.getLoginUrl(callback);
};

export default resolver;
