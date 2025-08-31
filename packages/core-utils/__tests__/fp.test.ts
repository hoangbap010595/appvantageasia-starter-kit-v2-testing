import { describe, expect, test } from 'vitest';
import deepFreeze from '../src/deepFreeze.js';

describe('fp.ts', () => {
    describe('deepFreeze', () => {
        test('should deeply freeze an object', () => {
            const obj = {
                a: 1,
                b: {
                    c: 2,
                    d: {
                        e: 3,
                    },
                },
                c: [42],
                d: [{ a: 21 }],
            };

            const frozenObj = deepFreeze(obj);

            expect(Object.isFrozen(frozenObj)).toBe(true);
            expect(Object.isFrozen(frozenObj.b)).toBe(true);
            expect(Object.isFrozen(frozenObj.b.d)).toBe(true);
            expect(Object.isFrozen(frozenObj.c)).toBe(true);
            expect(Object.isFrozen(frozenObj.d[0].a)).toBe(true);
        });
    });
});
