import { lazy } from '@loadable/component';
import LazyApp from './LazyApp';

// the entry point only display a single loader
// we moved as much as possible into bootstrap or further components to display the loading screen as fast as possible
// therefor slightly increasing UX
const LazyBootstrap = lazy(() => {
    // to further optimize loading speed we preload the app
    LazyApp.preload();

    return import('./Bootstrap');
});

export default LazyBootstrap;
