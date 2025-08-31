import { getCollections } from '@appvantageasia/core-users';
import { sendResetPassword } from '@appvantageasia/service-notifications';
import type { ObjectId } from 'mongodb';
import { generateToken } from '../../../expressServer/token.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import { TokenType } from './AuthFlows/LocalFlow.js';

const resolver: GqlMutationResolvers['requestNewPassword'] = async (root, args) => {
    const { email } = args;

    const { users } = await getCollections();
    const user = await users.findOne({ email: email.toLowerCase() });

    if (!user) {
        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'email', message: 'User not found' }],
        };
    }

    const token = generateToken<{ userId: ObjectId }>(TokenType.RequestNewPassword, { userId: user._id }, 15 * 60);
    await sendResetPassword({ userId: user._id, token });

    return {
        __typename: 'RequestNewPasswordSuccessfulResponse',
        result: true,
    };
};

export default resolver;
