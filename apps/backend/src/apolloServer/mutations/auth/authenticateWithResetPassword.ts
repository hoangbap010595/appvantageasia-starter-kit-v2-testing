import { localAuthentication, getCollections } from '@appvantageasia/core-users';
import type { ObjectId } from 'mongodb';
import { consumeToken } from '../../../expressServer/token.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import AuthLocalFlow, { TokenType } from './AuthFlows/LocalFlow.js';

const resolver: GqlMutationResolvers['authenticateWithResetPassword'] = async (root, args, context, info) => {
    const { token: initialToken, password } = args;

    // get the token
    const { userId } = await consumeToken<{ userId: ObjectId }>(TokenType.ResetPassword, initialToken);

    const { users } = await getCollections();
    const user = await users.findOne({ _id: userId });

    const flow = new AuthLocalFlow(context, info);

    if (!user) {
        throw new Error('user not found');
    }

    const result = await localAuthentication.checkNewPasswordValidity(password, user);

    if (result === 'minimum-length') {
        await flow.saveTrailOnFailure({ failure: 'INVALID_NEW_PASSWORD' }, user);

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'password', message: 'Invalid new password' }],
        };
    }

    if (result === 'reused-previous-password') {
        await flow.saveTrailOnFailure({ failure: 'INVALID_NEW_PASSWORD' }, user);

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'password', message: 'Reused previous password' }],
        };
    }

    const response = await localAuthentication.changePassword(user, password);

    return flow.finalizeAuthentication(response!);
};

export default resolver;
