import * as Sentry from '@sentry/react';
import { Route, Routes } from 'react-router';
import RedirectTo from '@/RedirectTo';
import NotFound from '@/components/blocks/NotFound';
import SystemLayout from '@/components/layouts/SystemLayout';
import TenantLayout from '@/components/layouts/TenantLayout';
import GatewayPage from '@/pages/GatewayPage/GatewayPage';
import ProfilePage from '@/pages/ProfilePage';
import SignOutPage from '@/pages/SignOutPage';
import SystemManagementPage from '@/pages/SystemManagementPage';

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

const AuthenticatedRoutes = () => (
    <SentryRoutes>
        <Route element={<RedirectTo to="/" />} path="login/*" />
        <Route element={<GatewayPage />} index />
        <Route element={<TenantLayout />} path=":tenantSlug/*">
            <Route element={<ProfilePage />} path="profile" />
            <Route element={<SignOutPage />} path="signout" />
            <Route element={<NotFound homePath="/" />} path="*" />
        </Route>
        <Route element={<SystemLayout />} path="_system/*">
            <Route element={<SystemManagementPage />} index />
            <Route element={<ProfilePage />} path="profile" />
            <Route element={<SignOutPage />} path="signout" />
            <Route element={<NotFound homePath="/" />} path="*" />
        </Route>
    </SentryRoutes>
);

export default AuthenticatedRoutes;
