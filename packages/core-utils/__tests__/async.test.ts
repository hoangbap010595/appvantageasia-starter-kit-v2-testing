import { describe, expect, test } from 'vitest';
import * as async from '../src/async.js';

describe('async.ts', () => {
    describe('map', () => {
        test('maps array with sync callbacks', async () => {
            const arr = [1, 2, 3];
            const result = await async.map(arr, item => item * 2);
            expect(result).toEqual([2, 4, 6]);
        });

        test('maps array with async callbacks', async () => {
            const arr = [1, 2, 3];
            const result = await async.map(arr, async item => {
                await new Promise(resolve => setTimeout(resolve, 5));
                return item * 2;
            });
            expect(result).toEqual([2, 4, 6]);
        });

        test('handles empty arrays', async () => {
            const result = await async.map([], item => item);
            expect(result).toEqual([]);
        });

        test('provides correct index and array parameters', async () => {
            const arr = ['a', 'b', 'c'];
            const indices: number[] = [];

            await async.map(arr, (item, index, array) => {
                indices.push(index);
                expect(array).toBe(arr);
                return item;
            });

            expect(indices).toEqual([0, 1, 2]);
        });
    });

    describe('forEach', () => {
        test('iterates with sync callbacks', async () => {
            const arr = [1, 2, 3];
            const result: number[] = [];

            await async.forEach(arr, item => {
                result.push(item * 2);
                return Promise.resolve();
            });

            expect(result).toEqual([2, 4, 6]);
        });

        test('iterates with async callbacks', async () => {
            const arr = [1, 2, 3];
            const result: number[] = [];

            await async.forEach(arr, async item => {
                await new Promise(resolve => setTimeout(resolve, 5));
                result.push(item * 2);
            });

            expect(result).toEqual([2, 4, 6]);
        });

        test('handles empty arrays', async () => {
            let callCount = 0;
            await async.forEach([], () => {
                callCount++;
                return Promise.resolve();
            });
            expect(callCount).toBe(0);
        });
    });

    describe('reduce', () => {
        test('reduces with sync callbacks', async () => {
            const arr = [1, 2, 3];
            const result = await async.reduce(arr, (acc, item) => Promise.resolve(acc + item), 0);
            expect(result).toBe(6);
        });

        test('reduces with async callbacks', async () => {
            const arr = [1, 2, 3];
            const result = await async.reduce(
                arr,
                async (acc, item) => {
                    await new Promise(resolve => setTimeout(resolve, 5));
                    return acc + item;
                },
                0
            );
            expect(result).toBe(6);
        });

        test('handles empty arrays', async () => {
            const initialValue = 'initial';
            const result = await async.reduce([], () => Promise.resolve('changed'), initialValue);
            expect(result).toBe(initialValue);
        });
    });

    describe('filter', () => {
        test('filters with sync predicates', async () => {
            const arr = [1, 2, 3, 4, 5];
            const result = await async.filter(arr, item => Promise.resolve(item % 2 === 0));
            expect(result).toEqual([2, 4]);
        });

        test('filters with async predicates', async () => {
            const arr = [1, 2, 3, 4, 5];
            const result = await async.filter(arr, async item => {
                await new Promise(resolve => setTimeout(resolve, 5));
                return item % 2 === 0;
            });
            expect(result).toEqual([2, 4]);
        });

        test('handles empty arrays', async () => {
            const result = await async.filter([], () => Promise.resolve(true));
            expect(result).toEqual([]);
        });

        test('respects execution order', async () => {
            const arr = [1, 2, 3];
            const executionOrder: number[] = [];

            await async.filter(arr, async item => {
                await new Promise(resolve => setTimeout(resolve, 10 - item));
                executionOrder.push(item);
                return true;
            });

            expect(executionOrder).toEqual([1, 2, 3]);
        });
    });
});
