import { otpAuthentication } from '@appvantageasia/core-users';
import { sendTwoFactorUpdate } from '@appvantageasia/service-notifications';
import TrailWithGql from '../../TrailWithGql.js';
import { requiresLoggedUser } from '../../decorators.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';

const resolver = requiresLoggedUser<GqlMutationResolvers['enableAuthenticator']>(async (root, args, context, info) => {
    const { getAbilities, user } = context;

    const abilities = await getAbilities();

    const profile = otpAuthentication.getProfile(user);

    if (!abilities.canUpdateUserSensitiveData(user) || profile?.secret) {
        return throwPermissionDenied(info, user);
    }

    // verify the token with the secret
    const { token } = args;
    const result = await otpAuthentication.validateAuthenticator(user, token);

    if (result === 'token-expired') {
        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'code', message: 'Token expired. Please try again.' }],
        };
    }

    if (!result.verified) {
        await new TrailWithGql().warn().user(user).graphql(info).eventType('FAILED_ENABLE_AUTHENTICATOR').save();

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'code', message: 'Invalid token. Please try again.' }],
        };
    }

    await otpAuthentication.enableAuthenticator(user, result.secret);
    await sendTwoFactorUpdate({ userId: user._id });

    return {
        __typename: 'EnableAuthenticatorSuccessfulResponse',
        result: true,
    };
});

export default resolver;
