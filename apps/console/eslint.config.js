import createFlatConfig from '@appvantageasia/eslint-config';
// eslint-disable-next-line import/no-unresolved
import graphqlPlugin from '@graphql-eslint/eslint-plugin';
import globals from 'globals';

const graphqlRecommendedRules = graphqlPlugin.configs['flat/schema-recommended'].rules;

/** @type {import("eslint").Config} */
const config = [
    {
        ignores: [
            'src/apolloClient.introspection.ts',
            'src/apolloClient.types.ts',
            'src/**/*.api.ts',
            'build/**',
            'storybook-static/**',
            'coverage/**',
        ],
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },
    ...createFlatConfig({ jsx: true, jsxRuntime: true }),
    {
        rules: {
            'jsx-a11y/no-autofocus': 'off',
        },
    },
    {
        files: ['**/*.graphql'],
        languageOptions: {
            parser: graphqlPlugin.parser,
        },
        plugins: {
            '@graphql-eslint': graphqlPlugin,
        },
    },
    {
        files: ['src/**/*.graphql'],
        rules: {
            ...graphqlRecommendedRules,
            '@graphql-eslint/naming-convention': [
                'error',
                {
                    VariableDefinition: 'camelCase',
                    OperationDefinition: {
                        style: 'PascalCase',
                        forbiddenPrefixes: ['Query', 'Mutation', 'Subscription', 'Get'],
                        forbiddenSuffixes: ['Query', 'Mutation', 'Subscription'],
                        ignorePattern: 'SSO',
                    },
                    FragmentDefinition: {
                        style: 'PascalCase',
                        forbiddenPrefixes: ['Fragment'],
                        forbiddenSuffixes: ['Fragment'],
                    },
                },
            ],
        },
    },
];

export default config;
