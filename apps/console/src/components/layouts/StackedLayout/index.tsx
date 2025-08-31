import { Bars2Icon } from '@heroicons/react/20/solid';
import { ErrorBoundary, type ErrorBoundaryProps } from '@sentry/react';
import { useState, type ReactNode, Suspense } from 'react';
import { Outlet } from 'react-router';
import MobileSidebar from './MobileSidebar';
import { handleError } from '@/components/blocks/Error';
import Footer from '@/components/blocks/Footer';
import Loader from '@/components/common/Loader';
import { NavbarItem } from '@/components/common/NavBar';

const beforeCapture: ErrorBoundaryProps['beforeCapture'] = scope => {
    scope.setTag('boundary', 'StackedLayout');
};

export interface StackedLayoutProps {
    navbar: ReactNode;
    sidebar: ReactNode;
}

const StackedLayout = ({ navbar, sidebar }: StackedLayoutProps) => {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className="relative isolate flex min-h-svh w-full flex-col">
            {/* Sidebar on mobile */}
            <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
                {sidebar}
            </MobileSidebar>

            {/* Navbar */}
            <header className="flex items-center px-4">
                <div className="py-2.5 lg:hidden">
                    <NavbarItem onClick={() => setShowSidebar(true)} aria-label="Open navigation">
                        <Bars2Icon />
                    </NavbarItem>
                </div>
                <div className="min-w-0 flex-1">{navbar}</div>
            </header>

            {/* Content */}
            <main className="flex flex-1 flex-col pb-2 lg:px-2">
                <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
                    <div className="mx-auto max-w-6xl">
                        <ErrorBoundary beforeCapture={beforeCapture} fallback={handleError}>
                            <Suspense fallback={<Loader />}>
                                <Outlet />
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default StackedLayout;
