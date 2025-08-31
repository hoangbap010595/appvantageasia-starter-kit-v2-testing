import { httpServer } from '../../expressServer/index.js';
import type { HealthMonitor } from '../registry.js';

const monitor: HealthMonitor = {
    name: 'api',
    run: async () => {
        if (!httpServer.listening) {
            return { state: 'NOT_SERVING', messages: ['Express server not listening'] };
        }

        return { state: 'SERVING' };
    },
};

export default monitor;
