/* eslint-disable no-var */
import type { Redis } from 'ioredis';

declare global {
    namespace globalThis {
        var redisInitializationPromise: Promise<Redis> | undefined;
        var redis: Redis | undefined;
    }
}
