import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
const config = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    plugins: [forms],
};

export default config;
