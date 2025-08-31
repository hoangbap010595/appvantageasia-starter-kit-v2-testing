/// <reference types="../types/deps.d.ts" />
import eslint from '@eslint/js';
import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
// eslint-disable-next-line import/default
import reactHookPlugin from 'eslint-plugin-react-hooks';
import ts from 'typescript-eslint';

export interface Options {
    jsx?: boolean;
    jsxRuntime?: boolean;
    noTypescript?: boolean;
    globals?: FlatConfig.GlobalsConfig;
    extraConfigs?: FlatConfig.ConfigArray;
}

const createFlatConfig = ({ jsx = false, noTypescript = false, jsxRuntime, extraConfigs = [] }: Options = {}) => {
    const configs: FlatConfig.ConfigArray = [eslint.configs.recommended, importPlugin.flatConfigs.recommended];

    if (!noTypescript) {
        const tsConfig = ts.config({
            files: ['**/*.{ts,cts,mts,tsx}'],
            extends: [ts.configs.strict, ts.configs.stylistic],
            languageOptions: {
                parserOptions: {
                    projectService: true,
                    project: true,
                },
            },
            settings: {
                'import/parsers': {
                    '@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx'],
                },
                'import/resolver': {
                    typescript: true,
                    node: {
                        extensions: ['.ts', '.cts', '.mts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'],
                    },
                },
            },
            rules: {
                // custom TS guidelines
                '@typescript-eslint/consistent-type-imports': 'error',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/triple-slash-reference': 'off',
                '@typescript-eslint/no-empty-object-type': 'off',
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        ignoreRestSiblings: true,
                    },
                ],

                // TypeScript compilation already ensures that named imports exist in the referenced module
                'import/named': 'off',

                // custom guidelines
                'import/no-named-as-default-member': 'off',
                'import/prefer-default-export': 'warn',
                'import/order': [
                    'error',
                    {
                        alphabetize: { order: 'asc' },
                        pathGroups: [
                            {
                                pattern: '*.{css,gif,jpeg,png,scss,svg}',
                                patternOptions: { matchBase: true },
                                group: 'index',
                                position: 'after',
                            },
                        ],
                    },
                ],
            },
        });

        configs.push(...tsConfig);
    }

    if (jsx) {
        configs.push(reactPlugin.configs.flat.recommended);

        if (jsxRuntime) {
            configs.push(reactPlugin.configs.flat['jsx-runtime']);
        }

        configs.push(
            jsxA11y.flatConfigs.recommended,
            {
                settings: {
                    react: { version: 'detect' },
                    'import/extensions': ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx'],
                },
            },
            {
                files: ['**/*.{js,ts,jsx,tsx}'],
                plugins: { 'react-hooks': reactHookPlugin },
                rules: {
                    ...reactHookPlugin.configs.recommended.rules,
                    'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],
                },
            }
        );
    }

    configs.push(...extraConfigs, prettierRecommended, {
        files: ['**/*.{js,ts,jsx,tsx}'],
        rules: {
            // enforce consistent brackets on conditions
            curly: 'error',
        },
    });

    return configs;
};

export default createFlatConfig;
