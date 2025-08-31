import createFlatConfig from '@appvantageasia/eslint-config';
// eslint-disable-next-line import/no-unresolved
import graphqlPlugin from '@graphql-eslint/eslint-plugin';
import globals from 'globals';

const graphqlRecommendedRules = graphqlPlugin.configs['flat/schema-recommended'].rules;

/** @type {import("eslint").Config} */
const config = [
    {
        ignores: [
            'src/**/*.d.ts',
            'src/apolloServer/resolver-types.ts',
            'src/apolloServer/schema-ast.graphql',
            'build/**',
        ],
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    ...createFlatConfig({ jsx: true, jsxRuntime: true }),
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
        files: ['schema/**/*.graphql'],
        rules: {
            ...graphqlRecommendedRules,
            '@graphql-eslint/no-unreachable-types': 'warn',
            '@graphql-eslint/strict-id-in-types': [
                // set it "off" instead of "error" for now
                // we will need a lot of refactoring on naming to support this rule
                'off',
                {
                    acceptedIdNames: ['id'],
                    acceptedIdTypes: ['ID', 'ObjectID'],
                },
            ],
            '@graphql-eslint/naming-convention': [
                'error',
                {
                    ...graphqlRecommendedRules['@graphql-eslint/naming-convention'][1],
                    EnumValueDefinition: 'PascalCase',
                },
            ],
        },
    },
];

export default config;
