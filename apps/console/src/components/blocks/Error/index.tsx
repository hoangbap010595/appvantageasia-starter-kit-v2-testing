/// <reference path="../../../types/bundler.d.ts" />
import type { FallbackRender } from '@sentry/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorProps {
    error: Error;
    resetError: () => void;
}

const Error = ({ error, resetError }: ErrorProps) => {
    const { t } = useTranslation('common');

    useEffect(() => {
        if (__IS_DEV__) {
            // must be within function call because that's when the element is defined for sure.
            const ErrorOverlay = customElements.get('vite-error-overlay');

            // don't open outside vite environment
            if (!ErrorOverlay) {
                return () => undefined;
            }

            const overlay = new ErrorOverlay(error);
            document.body.appendChild(overlay);

            const observer = new MutationObserver(mutationsList => {
                for (const mutation of mutationsList) {
                    if (mutation.removedNodes) {
                        for (const node of mutation.removedNodes) {
                            if (node === overlay) {
                                resetError();
                            }
                        }
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            return () => {
                observer.disconnect();
                overlay.remove();
            };
        }

        return () => undefined;
    }, [error, resetError]);

    return (
        <div className="text-center">
            <p className="text-base font-semibold text-pink-400">500</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-5xl">
                {t('common:pages:500:title')}
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-500">{t('common:pages:500:description')}</p>
        </div>
    );
};

export const handleError: FallbackRender = ({ error, resetError }) => (
    <Error error={error as Error} resetError={resetError} />
);

export default Error;
