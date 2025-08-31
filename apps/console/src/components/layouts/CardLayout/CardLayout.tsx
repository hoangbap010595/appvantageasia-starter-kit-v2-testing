import { ErrorBoundary, type ErrorBoundaryProps } from '@sentry/react';
import { Suspense, type ReactNode } from 'react';
import { Outlet } from 'react-router';
import { handleError } from '@/components/blocks/Error';
import Loader from '@/components/common/Loader';

const beforeCapture: ErrorBoundaryProps['beforeCapture'] = scope => {
    scope.setTag('boundary', 'CenteredLayout');
};

export interface CardLayoutProps {
    children?: ReactNode;
}

const CardLayout = ({ children }: CardLayoutProps) => {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Suspense fallback={<Loader />}>
                <div className="mx-auto max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-xl transition-colors dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/50">
                    <ErrorBoundary beforeCapture={beforeCapture} fallback={handleError}>
                        {children || <Outlet />}
                    </ErrorBoundary>
                </div>
            </Suspense>
        </div>
    );
};

export default CardLayout;
