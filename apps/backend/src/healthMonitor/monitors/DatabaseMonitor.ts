import { getDatabaseClient } from '@appvantageasia/core-database';
import type { HealthMonitor } from '../registry.js';

const monitor: HealthMonitor = {
    name: 'database',
    run: async () => {
        const { db } = await getDatabaseClient();

        try {
            await db.command({ ping: 1 });

            return { state: 'SERVING' };
        } catch (error) {
            console.error(error);

            return { state: 'NOT_SERVING' };
        }
    },
};

export default monitor;
