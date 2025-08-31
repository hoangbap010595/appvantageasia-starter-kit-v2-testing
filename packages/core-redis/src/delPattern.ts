import type { Redis } from 'ioredis';

const delPattern = (pattern: string, redis: Redis) =>
    new Promise<void>((resolve, reject) => {
        const stream = redis.scanStream({ match: pattern, count: 100 });

        stream.on('data', async keys => {
            if (keys.length) {
                const pipeline = redis.pipeline();
                keys.forEach((key: string) => pipeline.del(key));
                await pipeline.exec();
            }
        });

        stream.on('end', () => resolve());
        stream.on('error', error => reject(error));
    });

export default delPattern;
