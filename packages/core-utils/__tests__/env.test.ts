import { describe, expect, test, beforeEach } from 'vitest';
import * as env from '../src/env.js';

const initialEnv = process.env;

beforeEach(() => {
    process.env = { ...initialEnv };
});

describe('env.ts', () => {
    describe('getEnvKey', () => {
        test('gets env key', () => {
            expect(env.getEnvKey('FOO')).toEqual('APP_FOO');
        });

        test('adds prefix', () => {
            expect(env.getEnvKey.addPostPrefix('PRE')('FOO')).toEqual('APP_PRE_FOO');
        });
    });

    describe('getString', () => {
        test('gets string env var', () => {
            process.env.APP_FOO = 'bar';
            expect(env.getString(env.getEnvKey('FOO'))).toEqual('bar');
        });

        test('returns undefined value if not set without fallback', () => {
            expect(env.getString(env.getEnvKey('FOO'))).toBeUndefined();
        });

        test('returns default value if not set', () => {
            expect(env.getString(env.getEnvKey('FOO'), 'baz')).toEqual('baz');
        });
    });

    describe('getBoolean', () => {
        test('gets string env var', () => {
            process.env.APP_FOO = 'true';
            expect(env.getBoolean(env.getEnvKey('FOO'))).toEqual(true);
            process.env.APP_FOO = '1';
            expect(env.getBoolean(env.getEnvKey('FOO'))).toEqual(true);
            process.env.APP_FOO = 'false';
            expect(env.getBoolean(env.getEnvKey('FOO'))).toEqual(false);
            process.env.APP_FOO = '0';
            expect(env.getBoolean(env.getEnvKey('FOO'))).toEqual(false);
        });

        test('returns undefined value if not set without fallback', () => {
            expect(env.getBoolean(env.getEnvKey('FOO'))).toBeUndefined();
        });

        test('returns default value if not set', () => {
            expect(env.getBoolean(env.getEnvKey('FOO'), true)).toEqual(true);
            expect(env.getBoolean(env.getEnvKey('FOO'), false)).toEqual(false);
        });
    });
});
