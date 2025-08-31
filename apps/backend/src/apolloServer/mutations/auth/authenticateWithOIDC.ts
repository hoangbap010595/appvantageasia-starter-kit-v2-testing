import { URL } from 'node:url';
import { getRedisInstance } from '@appvantageasia/core-redis';
import { getCollections, oidcAuthentication, type UserDocument } from '@appvantageasia/core-users';
import { ObjectId } from 'mongodb';
import getOIDCCallback from '../../../utils/getOIDCCallback.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import OIDCFlow from './AuthFlows/OIDCFlow.js';

const resolver: GqlMutationResolvers['authenticateWithOIDC'] = async (root, args, context, info) => {
    const { users } = await getCollections();

    const oidcConfig = await oidcAuthentication.getConfig();
    const flow = new OIDCFlow(context, info);

    if (!oidcConfig) {
        await flow.saveTrailOnFailure({ failure: 'OIDC_CONFIG_UNAVAILABLE' });

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: '$root', message: 'OIDC not supported' }],
        };
    }

    const sessionId = context.http!.req.cookies.oidc;
    const redis = await getRedisInstance();
    const serializedState = await redis.get(`sso:oidc:${sessionId}`);

    if (!serializedState) {
        return {
            __typename: 'ErrorResponse',
            fields: [{ field: '$root', message: 'Authentication request expired' }],
        };
    }

    const oidcState = JSON.parse(serializedState);

    // rebuild the url
    const callback = getOIDCCallback();
    const url = new URL(callback);

    // set the code
    url.searchParams.set('code', args.code);

    if (args.state) {
        url.searchParams.set('state', args.state);
    }

    const accountInfo = await oidcAuthentication.verifyCredentials(url.toString(), oidcState);

    if (!accountInfo) {
        await flow.saveTrailOnFailure({ failure: 'OIDC_CODE_INVALID' });

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: '$root', message: 'Invalid Code' }],
        };
    }

    if (!accountInfo.email) {
        return {
            __typename: 'ErrorResponse',
            fields: [{ field: '$root', message: 'Email not received from the identity provider' }],
        };
    }

    const email = accountInfo.email.toLowerCase();
    let user: UserDocument | null = await users.findOne({ email });

    if (!user) {
        // we need to create a document for this user
        // signing with SSO will automatically create it
        user = {
            _id: new ObjectId(),
            email,
            name: accountInfo.name || email,
            isSuperAdmin: false,
            authProfiles: [], // profile will be filled by finalizeAuthentication
            _caslType: 'User',
        };

        await users.insertOne(user);
    }

    return flow.finalizeAuthentication(user);
};

export default resolver;
