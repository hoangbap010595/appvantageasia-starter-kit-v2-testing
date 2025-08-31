import { join, dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const getAbsolutePath = (value: string) => dirname(require.resolve(join(value, 'package.json')));

const addons: StorybookConfig['addons'] = [
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('storybook-addon-remix-react-router'),
];

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons,
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },
    core: {
        builder: '@storybook/builder-vite',
    },
    async viteFinal(config) {
        // Merge custom configuration into the default config
        const { mergeConfig } = await import('vite');

        return mergeConfig(config, {});
    },
};

export default config;
