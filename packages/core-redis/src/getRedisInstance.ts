/// <reference path="../types/global.d.ts" />
import { Redis } from 'ioredis';
import * as config from './config.js';

const getRedisInstance = async (): Promise<Redis> => {
    if (global.redis) {
        return global.redis;
    }

    if (global.redisInitializationPromise) {
        return global.redisInitializationPromise;
    }

    const promise = new Promise<Redis>((resolve, reject) => {
        const redis = new Redis(config.redisUri, {
            enableReadyCheck: true,
            enableOfflineQueue: false,
        });

        redis.on('error', error => {
            reject(error);
        });

        redis.on('ready', () => {
            resolve(redis);
        });
    }).then(redis => {
        global.redis = redis;
        global.redisInitializationPromise = undefined;

        return redis;
    });

    global.redisInitializationPromise = promise;

    return promise;
};

export default getRedisInstance;
