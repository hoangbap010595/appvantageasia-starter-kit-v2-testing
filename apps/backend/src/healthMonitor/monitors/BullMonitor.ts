import { queue } from '@appvantageasia/core-bull';
import type { HealthMonitor } from '../registry.js';

const monitor: HealthMonitor = {
    name: 'bull',
    run: async () => {
        for (const client of queue.clients) {
            if (client.status !== 'ready') {
                return { state: 'NOT_SERVING', messages: ['Worker not connected to redis'] };
            }
        }

        return { state: 'SERVING' };
    },
};

export default monitor;
