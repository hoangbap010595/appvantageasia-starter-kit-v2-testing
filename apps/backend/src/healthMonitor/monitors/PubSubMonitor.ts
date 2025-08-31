import { subscriber, publisher } from '@appvantageasia/core-pubsub';
import type { HealthMonitor } from '../registry.js';

const monitor: HealthMonitor = {
    name: 'pubSub',
    run: async () => {
        if (subscriber.status !== 'ready') {
            return { state: 'NOT_SERVING', messages: ['Redis connection (Subscriber) is not ready'] };
        }

        if (publisher.status !== 'ready') {
            return { state: 'NOT_SERVING', messages: ['Redis connection (Publisher) is not ready'] };
        }

        return { state: 'SERVING' };
    },
};

export default monitor;
