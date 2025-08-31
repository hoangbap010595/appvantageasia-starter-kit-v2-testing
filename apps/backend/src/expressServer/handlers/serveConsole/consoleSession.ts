import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import * as config from '../../../config.js';

export const createConsoleSession = () => {
    const sessionId = crypto.randomBytes(16).toString('hex');

    return jwt.sign({ sessionId }, config.sessionSecret);
};

export type ConsoleSessionState = ReturnType<typeof createConsoleSession>;

export const verifyConsoleSession = (token: string) => {
    try {
        const payload = jwt.verify(token, config.sessionSecret, { ignoreExpiration: true }) as { sessionId: string };

        return payload.sessionId;
    } catch {
        return null;
    }
};
