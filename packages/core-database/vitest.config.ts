import { defineConfig } from 'vitest/config';

export default defineConfig({
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
