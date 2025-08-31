import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import emitRevokeSession from './emitRevokeSession.js';
import getCollections, { type UserSession } from './getCollections.js';

export const getValidSessionById = async (sessionId: ObjectId) => {
    const { sessions } = await getCollections();

    // get the session first
    const session = await sessions.findOne({ _id: sessionId });

    // exclude expired or revoked sessions
    if (!session || session.revoked || dayjs().isAfter(session.expiresAt)) {
        return null;
    }

    return session;
};

export const createSessionForUserId = async (
    userId: ObjectId,
    expiresIn: number,
    { userAgent, ip }: { userAgent?: string; ip?: string | null }
) => {
    const { sessions } = await getCollections();

    const session: UserSession = {
        _id: new ObjectId(),
        userId,
        expiresAt: dayjs().add(expiresIn, 's').toDate(),
        lastActivityAt: new Date(),
        revoked: false,
        userAgent,
        ip,
    };

    await sessions.insertOne(session);

    return session;
};

export const refreshSessionActivityById = async (sessionId: ObjectId) => {
    const { sessions } = await getCollections();

    return sessions.updateOne(
        { _id: sessionId, revoked: false, expiresAt: { $lt: new Date() } },
        { $set: { lastActivityAt: new Date() } }
    );
};

export const extendSessionById = async (sessionId: ObjectId, expiresIn: number) => {
    const { sessions } = await getCollections();

    return sessions.findOneAndUpdate(
        { _id: sessionId, revoked: false, expiresAt: { $gt: new Date() } },
        { $set: { expiresAt: dayjs().add(expiresIn, 's').toDate() } },
        { returnDocument: 'after' }
    );
};

export const revokeSessionById = async (sessionId: ObjectId, userId: ObjectId) => {
    const { sessions } = await getCollections();

    await sessions.findOneAndUpdate(
        { _id: sessionId, revoked: false, expiresAt: { $gt: new Date() } },
        { $set: { revoked: true } }
    );

    await emitRevokeSession(userId, sessionId);
};
