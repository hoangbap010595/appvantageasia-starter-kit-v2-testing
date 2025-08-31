import * as Sentry from '@sentry/react';
import { Route, Routes, useLocation } from 'react-router';
import RedirectTo from '@/RedirectTo';
import NotFound from '@/components/blocks/NotFound';
import CardLayout from '@/components/layouts/CardLayout';
import LoginPage from '@/pages/LoginPage';
import MSALCallback from '@/pages/LoginPage/MSAL/MSALCallback';
import OIDCCallback from '@/pages/LoginPage/OIDC/OIDCCallback';
import ResetPasswordPage from '@/pages/ResetPasswordPage';

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

const UnauthenticatedRoutes = () => {
    const location = useLocation();

    return (
        <SentryRoutes>
            <Route element={<CardLayout />} path="login/*">
                <Route element={<LoginPage />} index />
                <Route element={<ResetPasswordPage />} path="resetPassword" />
                <Route element={<MSALCallback />} path="sso/msal" />
                <Route element={<OIDCCallback />} path="sso/oidc" />
                <Route element={<NotFound homePath=".." />} path="*" />
            </Route>
            <Route
                element={<RedirectTo state={{ from: location.pathname, fromState: location.state }} to="../login" />}
                path="*"
            />
        </SentryRoutes>
    );
};

export default UnauthenticatedRoutes;
