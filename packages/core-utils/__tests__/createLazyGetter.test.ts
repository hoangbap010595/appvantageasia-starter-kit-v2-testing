import { describe, vi, test, expect } from 'vitest';
import createLazyGetter from '../src/createLazyGetter.js';

describe('createLazyGetter.ts', () => {
    test('Expect to only resolved once and return the proper value', async () => {
        const value = {};
        const fn = vi.fn(async () => value);
        const lazyGetter = createLazyGetter(fn);
        // first call should create the promise
        // second call should get the same promise
        const values = await Promise.all([lazyGetter(), lazyGetter()]);
        // values should be the resolved object (same cursor)
        expect(values[0]).toBe(value);
        expect(values[1]).toBe(value);
        // resolver function should have been called only once
        expect(fn.mock.calls.length).toBe(1);
        // this time the value should be resolved right away
        expect(await lazyGetter()).toBe(value);
        // and the resolver should not have been called
        expect(fn.mock.calls.length).toBe(1);
    });
});
