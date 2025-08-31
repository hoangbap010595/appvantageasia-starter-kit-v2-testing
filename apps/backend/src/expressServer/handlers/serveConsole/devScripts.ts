import crypto from 'node:crypto';
import type { DetailedHTMLProps, LinkHTMLAttributes, ScriptHTMLAttributes } from 'react';
import urlJoin from 'url-join';
import { spaConsoleCdn } from '../../../config.js';

const nonce = crypto.randomBytes(16).toString('hex');

export const scripts: DetailedHTMLProps<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>[] = [
    {
        dangerouslySetInnerHTML: {
            __html:
                `import RefreshRuntime from '${spaConsoleCdn}/@react-refresh';\n` +
                'RefreshRuntime.injectIntoGlobalHook(window);\n' +
                'window.$RefreshReg$ = () => {};\n' +
                'window.$RefreshSig$ = () => (type) => type;\n' +
                'window.__vite_plugin_react_preamble_installed__ = true;',
        },
        type: 'module',
        nonce,
    },
    {
        src: urlJoin(spaConsoleCdn, '@vite/client'),
        type: 'module',
    },
    {
        src: urlJoin(spaConsoleCdn, '/src/index.tsx'),
        type: 'module',
    },
];

export const links: DetailedHTMLProps<LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>[] = [];

export const cspNonces: string[] = [nonce];
