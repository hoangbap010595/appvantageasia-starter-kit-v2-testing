import type { ErrorBoundaryProps } from '@sentry/react';
import { ErrorBoundary } from '@sentry/react';
import { useSentryToolbar } from '@sentry/toolbar';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import LazyApp from './LazyApp';
import { handleError } from './components/blocks/Error';
import i18n from './i18n';
import runtime from '@/runtime';

// sentry is only initialized now as this package will import react-router-dom
// which may be heavy on browsers as well
// so we accept the risk some errors may not be caught if it's due to JS incompatibility on early imports
import './initializeSentry';

const beforeCapture: ErrorBoundaryProps['beforeCapture'] = scope => {
    scope.setTag('boundary', 'Bootstrap');
};

const Bootstrap = () => {
    // Sentry toolbar is only enabled for developers with the localStorage flag
    // ref: https://docs.sentry.io/product/sentry-toolbar/setup/
    useSentryToolbar({
        enabled: localStorage.getItem('sentry:toolbar') === 'true',
        initProps: {
            organizationSlug: 'appvantage',
            projectIdOrSlug: '4509083196915712',
            environment: [runtime.environment],
        },
    });

    return (
        <BrowserRouter>
            <I18nextProvider i18n={i18n}>
                <ErrorBoundary beforeCapture={beforeCapture} fallback={handleError}>
                    <LazyApp />
                </ErrorBoundary>
            </I18nextProvider>
        </BrowserRouter>
    );
};

export default Bootstrap;
