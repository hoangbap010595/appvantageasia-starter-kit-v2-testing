import graphql from '@rollup/plugin-graphql';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    // @ts-expect-error this is not callable
    plugins: [graphql()],
    test: {
        include: ['./__tests__/*.test.ts?(x)'],
        environment: 'node',
        setupFiles: ['./__tests__/setupEnv.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/**'],
        },
    },
});
