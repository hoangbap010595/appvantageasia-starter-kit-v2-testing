import { lazy } from '@loadable/component';
import { Suspense, memo } from 'react';

const LazySubscriptionManager = lazy(() => import('./SubscriptionManager'));

const SubscriptionManager = () => (
    <Suspense fallback={null}>
        <LazySubscriptionManager />
    </Suspense>
);

export default memo(SubscriptionManager);
