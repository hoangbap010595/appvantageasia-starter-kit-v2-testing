// eslint-disable-next-line import/no-unresolved
import 'vite/modulepreload-polyfill';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import LazyBootstrap from './LazyBootstrap';
import Loader from './components/common/Loader';
import { initializeThemeMode } from './utils/darkMode';
import './index.css';

initializeThemeMode();

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const element = (
    <Suspense fallback={<Loader height="screen" />}>
        <LazyBootstrap />
    </Suspense>
);

root.render(element);
