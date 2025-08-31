import createFlatConfig from '@appvantageasia/eslint-config';

/** @type {import("eslint").Config} */
export default [
    { ignores: ['src/**/*.d.ts', '.react-email/**'] },
    ...createFlatConfig({ jsx: true, jsxRuntime: true }),
];
