import type { Preview } from '@storybook/react';
import '../src/index.css';

// override querySelector before any components are imported
const originalQuerySelector = document.querySelector.bind(document);
document.querySelector = (selector: string) => {
    // we are seeking to catch runtime retrieval to mock it
    if (selector === '[data-role="runtime-config"]') {
        const element = document.createElement('div');
        element.innerHTML = JSON.stringify({ appVersion: '0.0.0-storybook' });
        return element;
    }

    // otherwise use the original query selector
    return originalQuerySelector(selector);
};

const preview: Preview = {
    parameters: {
        mockingDate: new Date(2024, 11, 25),
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
