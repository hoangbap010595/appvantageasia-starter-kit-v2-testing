import { lazy } from '@loadable/component';
import CardLayout from './components/layouts/CardLayout';
import TenantLayout from './components/layouts/TenantLayout';

// lazily load the app which is the actual app
// the next component is only about initializing main context and tools for the app to run
const LazyApp = lazy(() => {
    // we preload components most likely to be used
    CardLayout.preload();
    TenantLayout.preload();

    return import('./App');
});

export default LazyApp;
