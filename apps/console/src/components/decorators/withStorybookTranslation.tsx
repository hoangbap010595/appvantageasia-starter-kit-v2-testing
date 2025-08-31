import * as i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Fetch from 'i18next-fetch-backend';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { makeDecorator } from 'storybook/preview-api';

const instance = i18n.createInstance().use(Fetch).use(LanguageDetector);

// Top-level await is not available in the configured target environments
instance.init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

interface TranslationDecoratorProps {
    children: ReactNode;
}

const TranslationDecorator = ({ children }: TranslationDecoratorProps) => (
    <I18nextProvider i18n={instance}>{children}</I18nextProvider>
);

const withStorybookTranslation = makeDecorator({
    name: 'withStorybookTranslation',
    parameterName: '',
    wrapper: (getStory, context) => <TranslationDecorator>{getStory(context) as ReactNode}</TranslationDecorator>,
});

export default withStorybookTranslation;
