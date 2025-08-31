import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error: This import is for Storybook's Vitest plugin
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

import viteConfig from './vite.config';

export default defineConfig(configEnv =>
    mergeConfig(
        viteConfig(configEnv),
        defineConfig({
            plugins: [
                storybookTest({
                    // The location of your Storybook config, main.js|ts
                    configDir: path.join(dirname, '.storybook'),
                    // This should match your package.json script to run Storybook
                    // The --ci flag will skip prompts and not open a browser
                    storybookScript: 'yarn storybook --ci',
                }),
            ],
            test: {
                // Enable browser mode
                browser: {
                    enabled: true,
                    // Make sure to install Playwright
                    provider: 'playwright',
                    headless: true,
                    instances: [{ browser: 'chromium' }],
                },
                setupFiles: ['./.storybook/vitest.setup.ts'],
                coverage: {
                    provider: 'istanbul',
                    include: ['src/**'],
                    all: false,
                    reporter: ['json', 'html'],
                },
            },
        })
    )
);
