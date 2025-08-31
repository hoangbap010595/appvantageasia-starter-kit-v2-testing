import type { UserDocument } from '@appvantageasia/core-users';
import type { GraphQLResolveInfo } from 'graphql/index.js';
import TrailWithGql from './TrailWithGql.js';

const throwPermissionDenied = async (info: GraphQLResolveInfo, user: UserDocument | null = null): Promise<never> => {
    const trail = new TrailWithGql().warn().anonymous().graphql(info).eventType('PERMISSION_DENIED');

    if (user) {
        trail.user(user);
    }

    await trail.save();

    throw new Error('Permission Denied');
};

export default throwPermissionDenied;
