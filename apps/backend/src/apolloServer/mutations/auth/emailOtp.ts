import { getRedisInstance } from '@appvantageasia/core-redis';
import { EJSON } from 'bson';
import type { ObjectId } from 'mongodb';

export const getEmailOtpCacheKey = (userId: ObjectId) => {
    return `emailOtp:L${userId}`;
};

export const cacheEmailOtp = async (cacheKey: string, otp: { code: string; email: string }) => {
    // we are using redis to cache opt code
    const redis = await getRedisInstance();
    // set the redis value
    await redis.set(cacheKey, EJSON.stringify(otp), 'EX', 10 * 60);
};

export const getCachedEmailOtp = async (cacheKey: string) => {
    // we are using redis to cache opt code
    const redis = await getRedisInstance();

    // get the redis value
    const value = await redis.get(cacheKey);
    if (value) {
        return EJSON.parse(value);
    }

    return null;
};
