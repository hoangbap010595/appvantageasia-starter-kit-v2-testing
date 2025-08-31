import type { Redis } from 'ioredis';
import { describe, expect, test, afterEach, afterAll, beforeEach } from 'vitest';
import { createCalls, isHealthy, process } from '../src/helpers.js';

const toggleRedisClient = (client: Redis, toBeReady = true): Promise<void> => {
    if (toBeReady && client.status !== 'ready') {
        return new Promise<void>(resolve => {
            client.connect(() => resolve());
        });
    }

    if (!toBeReady && ['ready', 'reconnecting', 'connecting', 'connect'].includes(client.status)) {
        return new Promise<void>(resolve => {
            client.once('end', () => resolve());
            client.disconnect(false);
        });
    }

    return Promise.resolve();
};

beforeEach(async () => {
    const { client, subscriber } = await import('../src/redis.js');
    await toggleRedisClient(client);
    await toggleRedisClient(subscriber);
    await client.flushdb();
});

afterEach(async () => {
    const { client, subscriber } = await import('../src/redis.js');
    await toggleRedisClient(client, false);
    await toggleRedisClient(subscriber, false);
});

afterAll(async () => {
    const { default: queue } = await import('../src/queue.js');
    await queue.close(true);
    const { client, subscriber } = await import('../src/redis.js');
    await toggleRedisClient(client, false);
    await toggleRedisClient(subscriber, false);
});

describe('helpers', () => {
    test('call() successfully registered the job', async () => {
        const { call } = createCalls<{ value: number; date: Date }>('bullTest01');
        const date = new Date();
        const job = await call({ value: 1, date });
        expect(job.data.value).toBe(1);
        expect(job.data.date.$date).toBe(date.toISOString());
        expect(job.name).toBe('bullTest01');
    });

    test('process() successfully receives jobs', async () => {
        const date = new Date();

        let resolveOnProcess: () => void;
        const promise = new Promise<void>(resolve => {
            resolveOnProcess = resolve;
        });

        process<{ value: number; date: Date }>('bullTest02', async data => {
            expect(data.value).toBe(1);
            expect(data.date.toISOString()).toBe(date.toISOString());
            resolveOnProcess();
        });

        const { call } = createCalls<{ value: number; date: Date }>('bullTest02');
        await call({ value: 1, date });
        await promise;
    });

    test('process() handles errors in job from the handler', async () => {
        let resolveOnProcess: () => void;
        const promise = new Promise<void>(resolve => {
            resolveOnProcess = resolve;
        });

        process<{}>('bullTest03', async () => {
            setTimeout(() => {
                resolveOnProcess();
            }, 1000);
            throw new Error('dummy test error bullTest03');
        });

        const { call } = createCalls<{}>('bullTest03');
        const job = await call({});
        await promise;
        expect(await job.getState()).toBe('failed');
        expect(await job.isFailed()).toBe(true);
    });

    test('process() handles errors in job from the domain', async () => {
        let resolveOnProcess: () => void;
        const promise = new Promise<void>(resolve => {
            resolveOnProcess = resolve;
        });

        // forcefully provide an invalid handler
        process<{}>('bullTest04', () => {
            throw new Error('Ups');
        });

        // since the handler is never call find another way to capture the failure
        const { default: queue } = await import('../src/queue.js');
        queue.on('failed', failedJob => {
            if (failedJob.name === 'bullTest04') {
                resolveOnProcess();
            }
        });

        const { call } = createCalls<{}>('bullTest04');
        const job = await call({});
        await promise;
        expect(await job.getState()).toBe('failed');
        expect(await job.isFailed()).toBe(true);
    });

    test('isHealthy() returns true if the redis client & subscriber are connected', async () => {
        const { client, subscriber } = await import('../src/redis.js');
        await toggleRedisClient(client, true);
        await toggleRedisClient(subscriber, true);
        expect(client.status).toBe('ready');
        expect(subscriber.status).toBe('ready');
        expect(await isHealthy()).toBe(true);
    });

    test('isHealthy() returns false if the redis client is disconnected', async () => {
        const { client, subscriber } = await import('../src/redis.js');
        await toggleRedisClient(client, false);
        await toggleRedisClient(subscriber, true);
        expect(client.status).not.toBe('ready');
        expect(subscriber.status).toBe('ready');
        expect(await isHealthy()).toBe(false);
    });

    test('isHealthy() returns false if the redis subscriber is disconnected', async () => {
        const { client, subscriber } = await import('../src/redis.js');
        await toggleRedisClient(client, true);
        await toggleRedisClient(subscriber, false);
        expect(client.status).toBe('ready');
        expect(subscriber.status).not.toBe('ready');
        expect(await isHealthy()).toBe(false);
    });
});
