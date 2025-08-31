import { revokeSession } from '../../../expressServer/session.js';
import { requiresLoggedUser } from '../../decorators.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';

const resolver = requiresLoggedUser<GqlMutationResolvers['revokeSession']>(async (root, { id }, context, info) => {
    const { getAbilities, user } = context;
    const abilities = await getAbilities();

    if (!abilities.canUpdateUserSensitiveData(user)) {
        return throwPermissionDenied(info, user);
    }

    await revokeSession(id, user._id);

    return true;
});

export default resolver;
