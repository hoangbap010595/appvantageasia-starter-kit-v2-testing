import TrailWithGql from '../../TrailWithGql.js';
import { requiresLoggedUser } from '../../decorators.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';
import { getCachedEmailOtp, getEmailOtpCacheKey } from '../auth/emailOtp.js';

const resolver = requiresLoggedUser<GqlMutationResolvers['verifyOtp']>(async (root, args, context, info) => {
    const { getAbilities, user } = context;
    const abilities = await getAbilities();

    if (!abilities.canUpdateUserSensitiveData(user)) {
        return throwPermissionDenied(info, user);
    }

    const { code, newEmail } = args;

    const cacheKey = getEmailOtpCacheKey(user._id);
    const opt = await getCachedEmailOtp(cacheKey);

    if (!opt) {
        await new TrailWithGql()
            .warn()
            .user(user)
            .graphql(info)
            .eventType('FAILED_VERIFY_OTP')
            .setSpec('context', { failure: 'OPT_EXPIRED_ON_VERIFY_EMAIL' })
            .save();

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'code', message: 'OPT is expired' }],
        };
    }

    if (opt.code !== code || opt.email !== newEmail) {
        await new TrailWithGql()
            .warn()
            .user(user)
            .graphql(info)
            .eventType('FAILED_VERIFY_OTP')
            .setSpec('context', { failure: 'OPT_UN_CORRECT_ON_VERIFY_EMAIL' })
            .save();

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'code', message: 'OTP is not correct' }],
        };
    }

    return {
        __typename: 'VerifyOtpSuccessfulResponse',
        result: true,
    };
});

export default resolver;
