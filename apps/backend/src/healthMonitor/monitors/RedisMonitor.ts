import { getRedisInstance } from '@appvantageasia/core-redis';
import type { HealthMonitor } from '../registry.js';

const monitor: HealthMonitor = {
    name: 'redis',
    run: async () => {
        const redis = await getRedisInstance();

        if (redis.status !== 'ready') {
            return { state: 'NOT_SERVING', messages: ['Redis connection is not ready'] };
        }

        return { state: 'SERVING' };
    },
};

export default monitor;
