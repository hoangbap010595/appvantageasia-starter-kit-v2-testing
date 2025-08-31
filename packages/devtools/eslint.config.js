import createFlatConfig from '@appvantageasia/eslint-config';
import globals from 'globals';

export default [
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    { ignores: ['build/**/*'] },
    ...createFlatConfig(),
];
