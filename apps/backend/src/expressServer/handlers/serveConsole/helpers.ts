/// <reference path="../../../types/bundler.d.ts" />
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import type { DetailedHTMLProps, LinkHTMLAttributes, ScriptHTMLAttributes } from 'react';
import urlJoin from 'url-join';
import * as config from '../../../config.js';

type ViteManifest = Record<
    string,
    {
        css?: string[];
        dynamicImports?: string[];
        file: string;
        isEntry: true | undefined;
        isDynamicEntry: true | undefined;
        imports?: string[];
        src: string;
    }
>;

export interface Manifest {
    links: DetailedHTMLProps<LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>[];
    scripts: DetailedHTMLProps<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>[];
    cspNonces: string[];
}

export const makeLink = (pathname: string) => urlJoin(config.spaConsoleCdn || '/public', pathname);

export const getManifest = __IS_DEV__
    ? (): Promise<Manifest> => import('./devScripts.js')
    : await (async () => {
          if (!existsSync(config.spaConsoleManifest)) {
              throw new Error("Couldn't find the manifest file for the SPA console");
          }

          // read the manifest file
          const manifest = await readFile(config.spaConsoleManifest, { encoding: 'utf-8' }).then(
              raw => JSON.parse(raw) as ViteManifest
          );

          // extract the entry we are looking for
          const entry = manifest['src/index.tsx'];

          if (!entry) {
              throw new Error('Expected entry to be defined for the SPA console');
          }

          // gather JS scripts
          const scripts: Manifest['scripts'] = [{ type: 'module', src: makeLink(entry.file) }];

          // gather links
          const links: Manifest['links'] = [];

          // first looks for CSS links
          if (entry.css) {
              entry.css.forEach(item => links.push({ rel: 'stylesheet', href: makeLink(item) }));
          }

          // then looks for dynamic imports, preloading those for faster boostraping time
          if (entry.dynamicImports) {
              entry.dynamicImports.forEach(item => {
                  const dynamicImportEntry = manifest[item];

                  if (dynamicImportEntry && dynamicImportEntry.file) {
                      links.push({
                          rel: 'preload',
                          as: 'script',
                          href: makeLink(dynamicImportEntry.file),
                          crossOrigin: 'anonymous',
                      });
                  }
              });
          }

          // because it's a promise here we can deal with dynamic nonces if there is a need for it
          // any script using nonce values for CSP will have to be generated on demand rather than ahead
          // for security purposes nonces cannot be constants
          // we do not care of static nonce for development server as it is to be used on local only
          return (): Promise<Manifest> => Promise.resolve({ scripts, links, cspNonces: [] });
      })();

export const getCspRule = (manifest: Manifest) => {
    // list of authorized sources for scripts
    const scriptSources: string[] = [
        // self scripts are always allowed
        "'self'",
        // sentry DSN for the toolbar
        'browser.sentry-cdn.com',
    ];

    if (config.withCoverage) {
        scriptSources.push("'unsafe-eval'");
    }

    if (config.spaConsoleCdn) {
        // we also authorized the CDN for our console
        const url = new URL(config.spaConsoleCdn);
        scriptSources.push(url.host);
    }

    // add nonces
    manifest.cspNonces.forEach(nonce => scriptSources.push(`'nonce-${nonce}'`));

    // finally generate the CSP rule
    // we may eventually have other rules for CSS or Workers
    return `script-src ${scriptSources.join(' ')};`;
};
