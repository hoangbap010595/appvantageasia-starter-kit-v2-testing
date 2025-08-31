import { getCollections, msalAuthentication, type UserDocument } from '@appvantageasia/core-users';
import { ObjectId } from 'mongodb';
import getMSALCallback from '../../../utils/getMSALCallback.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import MSALFlow from './AuthFlows/MSALFlow.js';

const resolver: GqlMutationResolvers['authenticateWithMSAL'] = async (root, args, context, info) => {
    const { users } = await getCollections();

    const msalConfig = await msalAuthentication.getConfig();
    const flow = new MSALFlow(context, info);

    if (!msalConfig) {
        await flow.saveTrailOnFailure({ failure: 'MSAL_CONFIG_UNAVAILABLE' });

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: '$root', message: 'MSAL not supported' }],
        };
    }

    const callback = getMSALCallback();
    const accountInfo = await msalAuthentication.verifyCredentials(args.code, callback);

    if (!accountInfo) {
        await flow.saveTrailOnFailure({ failure: 'MSAL_CODE_INVALID' });

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: '$root', message: 'Invalid Code' }],
        };
    }

    const email = accountInfo.username.toLowerCase();
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
