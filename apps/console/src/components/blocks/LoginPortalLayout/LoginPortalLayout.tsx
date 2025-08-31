import type { ReactNode } from 'react';
import { Suspense } from 'react';
import Loader from '../../common/Loader';
import AppLogo from '../AppLogo';
import Typography from '@/components/common/Typography';

export interface LoginPortalLayoutProps {
    title?: string;
    description?: string;
    children?: ReactNode;
}

const LoginPortalLayout = ({ title, description, children }: LoginPortalLayoutProps) => (
    <div className="flex min-h-full flex-1 flex-col justify-center lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <AppLogo />
            {title && (
                <Typography as="h2" className="mt-10 text-center tracking-tight">
                    {title}
                </Typography>
            )}
            {description && <div className="text-center text-base">{description}</div>}
        </div>
        {children && (
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <Suspense fallback={<Loader />}>{children}</Suspense>
            </div>
        )}
    </div>
);

export default LoginPortalLayout;
