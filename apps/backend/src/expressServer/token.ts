import { EJSON } from 'bson';
import jwt, { type SignOptions } from 'jsonwebtoken';
import omit from 'lodash/fp/omit.js';
import * as config from '../config.js';

type TokenPayload<Data extends {}> = Data & { __type: string };

export const generateToken = <Data extends {}>(type: string, data: Data, expiresIn: SignOptions['expiresIn']) => {
    const payload: TokenPayload<Data> = { ...data, __type: type };

    return jwt.sign(EJSON.serialize(payload), config.sessionSecret, { expiresIn });
};

// To control message during expiration error
const verifyJwt = (token: string, value: string) => {
    try {
        return jwt.verify(token, value);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Session has Expired');
        } else {
            throw new Error('Invalid token payload');
        }
    }
};

export const consumeToken = async <Data extends {}>(type: string, token: string) => {
    const tokenPayload: TokenPayload<any> = EJSON.deserialize(verifyJwt(token, config.sessionSecret) as Document);

    if (tokenPayload.__type !== type) {
        throw new Error('Invalid token payload');
    }

    return omit(['iat', 'exp'], tokenPayload) as TokenPayload<Data>;
};
