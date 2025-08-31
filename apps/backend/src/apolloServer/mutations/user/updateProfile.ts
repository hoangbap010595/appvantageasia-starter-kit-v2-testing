import { regexp } from '@appvantageasia/core-node-utils';
import { getCollections } from '@appvantageasia/core-users';
import { requiresLoggedUser } from '../../decorators.js';
import type { GqlMutationResolvers, GqlErrorResponse } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';

export const validateName = (name: string): null | GqlErrorResponse => {
    if (!regexp.name.test(name)) {
        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'name', message: 'Invalid name' }],
        };
    }

    if (name.length < 2) {
        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'name', message: 'Name must be at least 2 characters long' }],
        };
    }

    if (name.length > 50) {
        return {
            __typename: 'ErrorResponse',
            fields: [{ field: 'name', message: 'Name cannot be more than 50 characters long' }],
        };
    }

    return null;
};

const resolver = requiresLoggedUser<GqlMutationResolvers['updateProfile']>(async (root, args, context, info) => {
    const { getAbilities, user } = context;
    const abilities = await getAbilities();

    if (!abilities.canUpdateUserSensitiveData(user)) {
        return throwPermissionDenied(info, user);
    }

    const { name } = args;
    const result = validateName(name);
    if (result) {
        return result;
    }

    const { users } = await getCollections();
    await users.findOneAndUpdate({ _id: user._id }, { $set: { name: args.name } });

    return {
        __typename: 'UpdateProfileSuccessfulResponse',
        result: true,
    };
});

export default resolver;
