import createFlatConfig from '@appvantageasia/eslint-config';
import graphqlPlugin from '@graphql-eslint/eslint-plugin';
import pluginCypress from 'eslint-plugin-cypress/flat';

/** @type {import("eslint").Config} */
const config = [
    { ignores: ['coverage/**', 'cypress/videos/**', 'cypress/snapshots/**'] },
    ...createFlatConfig({
        extraConfigs: [
            pluginCypress.configs.recommended,
            pluginCypress.configs.globals,
            {
                files: ['**/*.ts'],
                processor: graphqlPlugin.processor,
            },
        ],
    }),
    {
        rules: {
            'cypress/no-unnecessary-waiting': 'off',
        },
    },
];

export default config;
