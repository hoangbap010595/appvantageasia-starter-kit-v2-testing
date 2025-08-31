import { otpAuthentication, getCollections } from '@appvantageasia/core-users';
import type { ObjectId } from 'mongodb';
import { consumeToken } from '../../../expressServer/token.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import AuthLocalFlow, { TokenType } from './AuthFlows/LocalFlow.js';

const resolver: GqlMutationResolvers['authenticateWithOtp'] = async (root, args, context, info) => {
    const { token: initialToken, password } = args;

    const flow = new AuthLocalFlow(context, info);

    // get the token
    const { userId } = await consumeToken<{ userId: ObjectId }>(TokenType.TOTP, initialToken);

    const { users } = await getCollections();
    const user = await users.findOne({ _id: userId });

    if (!user) {
        throw new Error('user not found');
    }

    const profile = otpAuthentication.getProfile(user);

    if (!profile) {
        throw new Error('user does not need otp');
    }

    // verify the token with the secret
    const isValid = await otpAuthentication.validateOtp(user, password);

    if (!isValid) {
        await flow.saveTrailOnFailure({ userId: user._id, failure: 'FAILED_VALIDATE_OTP' });

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'password', message: 'Invalid token. Pleas try again.' }],
        };
    }

    return flow.postOtpControls(user);
};

export default resolver;
