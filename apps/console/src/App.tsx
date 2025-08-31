import './dayjs.extend';
import { ApolloProvider } from '@apollo/client';
import * as Sentry from '@sentry/react';
import apolloClient from './apolloClient';
import UserSessionProvider from './contexts/UserSession';
import AppRoutes from './routes/AppRoutes';
import SubscriptionManager from './subscriptions';

const App = () => (
    <ApolloProvider client={apolloClient}>
        <UserSessionProvider>
            <SubscriptionManager />
            <AppRoutes />
        </UserSessionProvider>
    </ApolloProvider>
);

export default Sentry.withProfiler(App, { name: 'App' });
