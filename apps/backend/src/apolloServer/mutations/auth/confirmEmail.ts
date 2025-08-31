import { getCollections, localAuthentication } from '@appvantageasia/core-users';
import TrailWithGql from '../../TrailWithGql.js';
import { requiresLoggedUser } from '../../decorators.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';

const resolver = requiresLoggedUser<GqlMutationResolvers['confirmEmail']>(async (root, args, context, info) => {
    const { getAbilities, user } = context;
    const abilities = await getAbilities();

    if (!abilities.canUpdateUserSensitiveData(user)) {
        return throwPermissionDenied(info, user);
    }

    const { password, newEmail } = args;

    const isMatch = await localAuthentication.comparePassword(user, password);

    if (!isMatch) {
        await new TrailWithGql()
            .warn()
            .user(user)
            .graphql(info)
            .eventType('FAILED_CHANGE_EMAIL')
            .setSpec('context', {
                email: newEmail,
                failure: 'PASSWORD_NOT_MATCH_ON_CONFIRM_EMAIL',
            })
            .save();

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'password', message: 'Password is not matched' }],
        };
    }

    const { users } = await getCollections();
    await users.findOneAndUpdate({ _id: user._id }, { $set: { email: newEmail.toLowerCase() } });

    return {
        __typename: 'ConfirmEmailSuccessfulResponse',
        result: true,
    };
});

export default resolver;
