import dayjs from 'dayjs';
import type { GqlUserSessionResolvers } from '../resolver-types.js';

const resolver: GqlUserSessionResolvers = {
    id: parent => parent._id,
    isValid: parent => {
        const now = new Date();

        return dayjs(parent.expiresAt).isAfter(now) && !parent.revoked;
    },
};

export default resolver;
