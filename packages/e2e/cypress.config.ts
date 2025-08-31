import { loadEnvironment } from '@appvantageasia/devtools';
import { installPlugin } from '@chromatic-com/cypress';
import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
    projectId: 'hhu676',
    video: true,
    videoCompression: true,
    hosts: {
        '*.localhost': '127.0.0.1',
    },
    e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL || 'http://127.0.0.1:3000',
        async setupNodeEvents(on, config) {
            // replace webpack by vite for preprocessor
            // @ts-expect-error TS2349: This expression is not callable.
            on('file:preprocessor', vitePreprocessor());

            // load environments
            loadEnvironment(import.meta.dirname, 'test', true);

            config.env.prometheusPort = parseInt(process.env.APP_PROMETHEUS_EXPORT_PORT || '9090', 10);

            // load coverage plugin and then apply it
            const { default: registerCodeCoverageTasks } = await import('@cypress/code-coverage/task.js');

            // @ts-expect-error TS2349: This expression is not callable.
            registerCodeCoverageTasks(on, config);

            // register custom tasks
            const { default: customTasks } = await import('./cypress/tasks/index.js');
            on('task', customTasks);

            // install chromatic
            installPlugin(on, config);

            // we need to return the mutated config
            return config;
        },
    },
    env: {
        disableAutoSnapshot: true,
        assetDomains: process.env.CYPRESS_ASSET_DOMAINS?.split(',') || [],
        codeCoverage: {
            // set an empty array to force Cypress to not collect from backend
            url: [],
            exclude: ['node_modules/**/*'],
        },
    },
});
