import { describe, expect, test, vi, beforeEach, afterAll, afterEach } from 'vitest';
import getDatabaseClient, { closeConnections } from '../src/getDatabaseClient.js';
import getEncryptedClient from '../src/getEncryptedClient.js';
import getRegularClient from '../src/getRegularClient.js';

vi.mock('../src/getRegularClient.js', async importOriginal => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const actualGetRegularClient = await importOriginal<typeof import('../src/getRegularClient.js')>();

    return {
        ...actualGetRegularClient,
        default: vi.fn(actualGetRegularClient.default),
    };
});

vi.mock('../src/getEncryptedClient.js', async importOriginal => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const actualGetEncryptedClient = await importOriginal<typeof import('../src/getEncryptedClient.js')>();

    return {
        ...actualGetEncryptedClient,
        default: vi.fn(actualGetEncryptedClient.default),
    };
});

beforeEach(async () => {
    await closeConnections(true);
});

afterAll(() => closeConnections(true));

afterEach(() => vi.resetAllMocks());

describe('getDatabaseClient', () => {
    test('returns regular client if no encryption', async () => {
        const context = await getDatabaseClient();
        expect(getRegularClient).toHaveBeenCalledTimes(1);
        expect(getEncryptedClient).toHaveBeenCalledTimes(1);
        expect(context.client).not.toBeNull();
        expect(context.clientEncryption).toBeUndefined();
        expect(context.encryptedClient).toBeUndefined();
        expect(getRegularClient).toHaveResolvedWith(context.client);
        expect(getEncryptedClient).toHaveResolvedWith(null);
    });

    test('returns encrypted client if available', async () => {
        /* todo yet to be done */
    });

    test('uses cache', async () => {
        // ensure we have a clean cacheat first
        expect(global!.mongo!.value).toBeNull();
        expect(global!.mongo!.promise).toBeNull();
        // start two promises at the same time for the same client
        const firstCallPromise = getDatabaseClient();
        const secondCallPromise = getDatabaseClient();
        // we expect to have no client yet in cache but to have a promise
        expect(global!.mongo!.value).toBeNull();
        expect(global!.mongo!.promise).not.toBeNull();
        // then resolve those
        const firstCall = await firstCallPromise;
        const secondCall = await secondCallPromise;
        // client should be the same
        expect(firstCall).toBe(secondCall);
        // we expect client to be retrieved only once
        expect(getRegularClient).toHaveBeenCalledTimes(1);
        expect(getEncryptedClient).toHaveBeenCalledTimes(1);
        // call a third time expecting to heat the cache
        const thirdCall = await getDatabaseClient();
        expect(thirdCall).toBe(firstCall);
        // then close connections to ensure cache is properly cleaned
        await closeConnections(true);
        expect(global!.mongo!.value).toBeNull();
        expect(global!.mongo!.promise).toBeNull();
    });
});
