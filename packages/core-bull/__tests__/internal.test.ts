import { EventEmitter } from 'node:events';
import { describe, test, beforeAll, expect } from 'vitest';

const eventEmitter = new EventEmitter();

describe('internal', () => {
    beforeAll(async () => {
        process.env.APP_BULL_CLEAN_UP_JOB_INTERVAL = '500';
        // clean the database first
        const { client } = await import('../src/redis.js');
        await client.flushdb();
        // setup internal jobs and the periods
        const { setupProcess, setupPeriods } = await import('../src/internal.js');
        setupProcess();
        await setupPeriods();
        // setup listening on the queue
        const { default: queue } = await import('../src/queue.js');
        await queue.pause();
        queue.on('global:completed', async (jobId: string) => {
            if (/^repeat:.+/.test(jobId)) {
                const job = await queue.getJob(jobId);
                eventEmitter.emit('completed', job);
            }
        });
    });

    test('Clean up run successfully when there is nothing to clean up', async () => {
        const { default: queue } = await import('../src/queue.js');
        await queue.resume();
        const job = await new Promise<any>(resolve => {
            eventEmitter.once('completed', resolve);
        });
        await queue.pause();
        expect(job.name).toBe('internal_clean_up');
    });
});
