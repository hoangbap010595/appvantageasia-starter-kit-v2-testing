import baseConfig from '@appvantageasia/eslint-config/.prettierrc.js';

/** @type {import("prettier").Config} */
const config = {
    ...baseConfig,
    plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
