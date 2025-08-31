import { getRedisInstance } from '@appvantageasia/core-redis';
import { oidcAuthentication } from '@appvantageasia/core-users';
import { nanoid } from 'nanoid';
import getOIDCCallback from '../../../utils/getOIDCCallback.js';
import type { GqlQueryResolvers } from '../../resolver-types.js';

const resolver: GqlQueryResolvers['OIDCUrl'] = async (root, args, context) => {
    const oidcConfig = await oidcAuthentication.getConfig();

    if (!oidcConfig) {
        return null;
    }

    const callback = getOIDCCallback();

    const { url, state } = await oidcAuthentication.getLoginUrl(callback);

    // we create a session to persist the OIDC state
    const sessionId = nanoid();
    const redis = await getRedisInstance();
    await redis.set(`sso:oidc:${sessionId}`, JSON.stringify(state), 'EX', 15 * 60);

    // set cookie
    context.http!.res.cookie('oidc', sessionId, {
        // 15mn lifetime, matching the redis key TTL
        maxAge: 15 * 60 * 1000,
        // prevents JavaScript access
        httpOnly: true,
        // only sent over HTTPS (localhost is an exception so it still work for development
        secure: true,
        // as it's going to be used in Ajax/XHR we need to authorize it
        sameSite: 'none',
    });

    return url;
};

export default resolver;
