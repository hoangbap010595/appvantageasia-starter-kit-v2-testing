import { getCollections } from '@appvantageasia/core-users';
import { requiresLoggedUser } from '../../decorators.js';
import type { GqlQueryResolvers } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';
import { paginateAggregation } from '../../utils/pagination.js';

const resolver = requiresLoggedUser<GqlQueryResolvers['userSessions']>(
    async (root, { id, pagination }, context, info) => {
        const { getAbilities, user } = context;
        const abilities = await getAbilities();

        if (!abilities.canReadUserSensitiveData(user)) {
            return throwPermissionDenied(info);
        }

        const { sessions } = await getCollections();

        return paginateAggregation(
            sessions,
            [{ $match: { userId: id, revoked: false } }, { $sort: { lastActivityAt: -1 } }],
            pagination
        );
    }
);

export default resolver;
