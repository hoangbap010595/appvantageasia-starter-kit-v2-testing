import { getCollections } from '@appvantageasia/core-users';
import { sendOTP } from '@appvantageasia/service-notifications';
import { customAlphabet } from 'nanoid';
import TrailWithGql from '../../TrailWithGql.js';
import { requiresLoggedUser } from '../../decorators.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';
import { cacheEmailOtp, getEmailOtpCacheKey } from './emailOtp.js';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6);

const resolver = requiresLoggedUser<GqlMutationResolvers['changeEmail']>(async (root, args, context, info) => {
    const { getAbilities, user } = context;
    const abilities = await getAbilities();

    if (!abilities.canUpdateUserSensitiveData(user)) {
        return throwPermissionDenied(info, user);
    }

    const { newEmail } = args;

    if (newEmail === user.email) {
        await new TrailWithGql()
            .warn()
            .user(user)
            .graphql(info)
            .eventType('FAILED_CHANGE_EMAIL')
            .setSpec('context', { email: newEmail, failure: 'SAME_EMAIL_ON_UPDATE_EMAIL' })
            .save();

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'newEmail', message: 'New email is same as current one' }],
        };
    }

    const { users } = await getCollections();
    const find = await users.findOne({ email: newEmail.toLowerCase() });
    if (find) {
        await new TrailWithGql()
            .warn()
            .user(user)
            .graphql(info)
            .eventType('FAILED_CHANGE_EMAIL')
            .setSpec('context', { email: newEmail, failure: 'EXISTING_EMAIL_ON_UPDATE_EMAIL' })
            .save();

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'newEmail', message: 'There is an existing account for this email' }],
        };
    }

    const code = nanoid();
    const cacheKey = getEmailOtpCacheKey(user._id);
    await cacheEmailOtp(cacheKey, { code, email: newEmail });

    await sendOTP({ email: newEmail, otp: { code, leftTime: 10 } });

    return {
        __typename: 'ChangeEmailSuccessfulResponse',
        result: true,
    };
});

export default resolver;
