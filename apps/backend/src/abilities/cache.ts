import { getRedisInstance, delPattern } from '@appvantageasia/core-redis';
import type { MongoAbility } from '@casl/ability';
import { createMongoAbility } from '@casl/ability';
import { EJSON } from 'bson';
import type { ObjectId } from 'mongodb';
import detectSubjectType from './detectSubjectType.js';

export const getAbilitiesCacheKey = (userId?: ObjectId) => `abilities:users:${userId || 'none'}`;

export const getCachedAbilities = async (cacheKey: string) => {
    // we are using redis to cache abilities
    const redis = await getRedisInstance();
    // get the redis value
    const cachedAbilities = await redis.get(cacheKey);

    if (cachedAbilities) {
        // if there is we need to restore types such as OID and Date
        const rules = EJSON.parse(cachedAbilities);

        return createMongoAbility(rules, { detectSubjectType });
    }

    return null;
};

export const cacheAbilities = async (cacheKey: string, abilities: MongoAbility) => {
    // we are using redis to cache abilities
    const redis = await getRedisInstance();
    // set the redis value
    await redis.set(cacheKey, EJSON.stringify(abilities.rules), 'EX', 10 * 60);
};

export const revokeUserCache = async (userId: ObjectId) => {
    // we are using redis to cache abilities
    const redis = await getRedisInstance();
    // find all keys that match the pattern and delete the keys
    await delPattern(`abilities:users:${userId}`, redis);
};

export const revokeAllCache = async () => {
    // we are using redis to cache abilities
    const redis = await getRedisInstance();
    // find all keys that match the pattern and delete the keys
    await delPattern('abilities:users:*', redis);
};
