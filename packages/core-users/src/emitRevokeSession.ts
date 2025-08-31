import type { ObjectId } from 'mongodb';

const getPubSub = async () => {
    const { pubSub } = await import('@appvantageasia/core-pubsub');

    return pubSub;
};

const emitRevokeSession = async (userId: ObjectId, sessionId: ObjectId) => {
    const channel = `pubSub.userSession.${userId}.${sessionId}.revoked`;
    const pubSub = await getPubSub();

    return pubSub.publish(channel, {
        eventFromUserSession: {
            __typename: 'UserSessionBroadcast',
            revokeSession: true,
        },
    });
};

export default emitRevokeSession;
