import broker from '../../broker.js';
import type { HealthMonitor } from '../registry.js';

const monitor: HealthMonitor = {
    name: 'broker',
    run: async () => {
        if (!broker.started) {
            return { state: 'NOT_SERVING', messages: ['Broker not connected'] };
        }

        return { state: 'SERVING' };
    },
};

export default monitor;
