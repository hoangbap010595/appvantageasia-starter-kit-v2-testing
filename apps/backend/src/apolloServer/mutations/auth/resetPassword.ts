import { getCollections, localAuthentication } from '@appvantageasia/core-users';
import type { ObjectId } from 'mongodb';
import { consumeToken } from '../../../expressServer/token.js';
import TrailWithGql from '../../TrailWithGql.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import { TokenType } from './AuthFlows/LocalFlow.js';

const resolver: GqlMutationResolvers['resetPassword'] = async (root, args, context, info) => {
    const { token: initialToken, password } = args;

    // get the token
    const { userId } = await consumeToken<{ userId: ObjectId }>(TokenType.RequestNewPassword, initialToken);

    const { users } = await getCollections();
    const user = await users.findOne({ _id: userId });

    if (!user) {
        throw new Error('user not found');
    }

    const result = await localAuthentication.checkNewPasswordValidity(password, user);

    if (result === 'minimum-length') {
        await new TrailWithGql()
            .warn()
            .user(user)
            .graphql(info)
            .eventType('FAILED_PASSWORD_RESET')
            .setSpec('context', { failure: 'INVALID_NEW_PASSWORD' })
            .save();

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'password', message: 'Invalid new password' }],
        };
    }

    if (result === 'reused-previous-password') {
        await new TrailWithGql()
            .warn()
            .user(user)
            .graphql(info)
            .eventType('FAILED_PASSWORD_RESET')
            .setSpec('context', { failure: 'REUSED_PASSWORD' })
            .save();

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'password', message: 'Reused previous password' }],
        };
    }

    await localAuthentication.changePassword(user, password);

    return {
        __typename: 'ResetPasswordSuccessfulResponse',
        result: true,
    };
};

export default resolver;
