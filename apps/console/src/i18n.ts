/// <reference path="./types/bundler.d.ts" />
import * as i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import Fetch from 'i18next-fetch-backend';
import { initReactI18next } from 'react-i18next';
import join from 'url-join';
import runtime from './runtime';

const instance = i18n.createInstance().use(Fetch).use(detector).use(initReactI18next);

// Top-level await is not available in the configured target environments
instance.init({
    supportedLngs: ['en'],
    interpolation: {
        escapeValue: false,
    },
    backend: {
        // path where resources get loaded from
        loadPath: () => {
            const url = new URL(runtime.translationsSink);
            const href = join(url.href, 'locales/{{lng}}/{{ns}}.json');

            if (__IS_DEV__) {
                // in development to ensure we always get the latest translations
                // we prefix with the time so it may not be cached
                return `${href}?t=${new Date().getTime()}`;
            }

            // in production we use the app version to ensure we always get the matching translations
            // and still allow caching
            return `${href}?v=${runtime.appVersion}`;
        },

        // init option for fetch
        requestOptions: {
            mode: 'cors',
            credentials: 'omit',
            cache: 'default',
        },
    },
    ns: ['common', 'sidebar'],
    defaultNS: 'common',
    fallbackLng: ['en'],
});

export default instance;
