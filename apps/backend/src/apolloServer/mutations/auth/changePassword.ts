import { localAuthentication } from '@appvantageasia/core-users';
import { sendPasswordUpdate } from '@appvantageasia/service-notifications';
import TrailWithGql from '../../TrailWithGql.js';
import { requiresLoggedUser } from '../../decorators.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';

const resolver = requiresLoggedUser<GqlMutationResolvers['changePassword']>(async (root, args, context, info) => {
    const { getAbilities, user } = context;
    const abilities = await getAbilities();

    if (!abilities.canUpdateUserSensitiveData(user)) {
        return throwPermissionDenied(info, user);
    }

    if (!(await localAuthentication.comparePassword(user, args.currentPassword))) {
        await new TrailWithGql().warn().user(user).graphql(info).eventType('FAILED_CHANGE_PASSWORD').save();

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'currentPassword', message: 'Invalid current password' }],
        };
    }

    const result = await localAuthentication.checkNewPasswordValidity(args.newPassword, user);

    if (result === 'minimum-length') {
        await new TrailWithGql().warn().user(user).graphql(info).eventType('FAILED_CHANGE_PASSWORD').save();

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'newPassword', message: 'Invalid new password' }],
        };
    }

    if (result === 'reused-previous-password') {
        await new TrailWithGql().warn().user(user).graphql(info).eventType('FAILED_CHANGE_PASSWORD').save();

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'newPassword', message: 'Reused previous password' }],
        };
    }

    await localAuthentication.changePassword(user, args.newPassword);
    await sendPasswordUpdate({ userId: user._id });

    return {
        __typename: 'ChangePasswordSuccessfulResponse',
        result: true,
    };
});

export default resolver;
