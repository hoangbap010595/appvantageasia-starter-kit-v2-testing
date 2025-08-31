import { queue, internalJobs } from '@appvantageasia/core-bull';
import { print } from '@appvantageasia/core-node-utils';
import {
    setupProcess as setupNotificationsProcess,
    setupPeriods as setupNotificationsPeriods,
} from '@appvantageasia/service-notifications';

export const setupProcess = async () => {
    // we do not need to await for these processes
    internalJobs.setupProcess();
    setupNotificationsProcess();
};

export const setupPeriods = async () => {
    await internalJobs.setupPeriods();
    await setupNotificationsPeriods();
};

export const stopQueue = async () => {
    await queue.close();
    print.info(`Queue stopped taking on jobs`, 'BULL');
};

export default queue;
