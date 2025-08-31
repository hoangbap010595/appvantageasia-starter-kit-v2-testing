import { print } from '@appvantageasia/core-node-utils';
import dayjs from 'dayjs';
import * as config from './config.js';
import { createCalls, process } from './helpers.js';
import queue from './queue.js';

const internalCleanUp = createCalls<{}>('internal_clean_up');

export const setupProcess = async () => {
    await process<{}>('internal_clean_up', async () => {
        const retentionThreshold = dayjs().subtract(config.jobRetention, 'day');

        print.info(
            `Removing completed and failed jobs finished earlier than ${retentionThreshold.toISOString()}`,
            'BULL'
        );

        const completed = await queue
            .getCompleted()
            .then(jobs => jobs.filter(job => dayjs(job.finishedOn).isBefore(retentionThreshold)))
            .then(jobs => jobs.map(job => job.remove()))
            .then(promises => Promise.all(promises))
            .then(results => results.length);

        print.info(`Removed ${completed} completed jobs from queue ${queue.name}`, 'BULL');

        const failed = await queue
            .getFailed()
            .then(jobs => jobs.filter(job => dayjs(job.finishedOn).isBefore(retentionThreshold)))
            .then(jobs => jobs.map(job => job.remove()))
            .then(promises => Promise.all(promises))
            .then(results => results.length);

        print.info(`Removed ${failed} failed jobs from queue ${queue.name}`, 'BULL');

        return { completed, failed };
    });
};

export const setupPeriods = async () => {
    await internalCleanUp.syncRepeatableJobs([
        {
            jobId: 'daily_internal_clean_up',
            data: {},
            repeat: config.cleanUpJobInterval ? { every: config.cleanUpJobInterval } : { cron: config.cleanUpJobCron },
        },
    ]);
};
