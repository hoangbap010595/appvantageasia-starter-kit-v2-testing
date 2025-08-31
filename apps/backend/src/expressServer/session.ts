import { type UserSession, getCollections, type UserDocument, sessions } from '@appvantageasia/core-users';
import { EJSON } from 'bson';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import type { ObjectId } from 'mongodb';
import * as config from '../config.js';

export interface SessionPayload {
    // even though the userId may be retrieved by reading session data
    // it's still convenient to get the information from the payload in some situation
    userId: ObjectId;
    // keep track of the session ID because the token may be remotely invalidated
    sessionId: ObjectId;
    // add a predictable constant to ensure the token is not mixed up for another
    _type: 'session';
}

export const createSession = async (
    userId: ObjectId,
    context: { userAgent?: string; ip?: string | null }
): Promise<{ token: string; session: UserSession }> => {
    const session = await sessions.createSessionForUserId(userId, config.sessionExpiresIn, context);
    const payload: SessionPayload = { userId, sessionId: session._id, _type: 'session' };
    const token = jwt.sign(EJSON.serialize(payload), config.sessionSecret, { expiresIn: config.sessionExpiresIn });

    return { token, session };
};

export const validateSession = async (token: string): Promise<UserSession | null> => {
    try {
        const tokenPayload = await jwt.verify(token, config.sessionSecret);
        const payload: SessionPayload = EJSON.deserialize(tokenPayload as jwt.JwtPayload);

        if (payload._type !== 'session') {
            // simple check to ensure we didn't retrieve a token that is not a session
            return null;
        }

        const session = await sessions.getValidSessionById(payload.sessionId);

        if (!session) {
            return null;
        }

        return session;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return null;
        }

        // throw the error back
        throw error;
    }
};

export const getUserContextFromRequest = async (
    request: Request,
    refreshSession = true
): Promise<null | false | { user: UserDocument; session: UserSession }> => {
    const header = request.header('Authorization');

    if (!header) {
        return null;
    }

    // extract the authorization type and token
    const [type, token] = header.split(' ');

    if (type.toLowerCase() !== 'bearer' || !token) {
        // we do not support other kind of authorization
        return false;
    }

    // get the session validated
    const session = await validateSession(token);

    if (!session) {
        // this is wrong, it means whatever credentials we have is not as expected
        return false;
    }

    if (refreshSession) {
        // refresh the session
        await sessions.refreshSessionActivityById(session._id);
    }

    // get the user by the ID
    const { users } = await getCollections();
    const user = await users.findOne({ _id: session.userId });

    if (!user) {
        // this is unexpected
        return false;
    }

    return { user, session };
};

export const extendSession = async (sessionId: ObjectId) => {
    const session = await sessions.extendSessionById(sessionId, config.sessionExpiresIn);

    if (!session) {
        throw new Error('Session not found');
    }

    const payload: SessionPayload = { userId: session.userId, sessionId: session._id, _type: 'session' };
    const token = jwt.sign(EJSON.serialize(payload), config.sessionSecret, { expiresIn: config.sessionExpiresIn });

    return { token, session };
};

export const revokeSession = async (sessionId: ObjectId, userId: ObjectId) =>
    sessions.revokeSessionById(sessionId, userId);
