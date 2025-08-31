import os from 'node:os';
import path from 'node:path';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import { sentryVitePlugin } from '@sentry/vite-plugin';
// @ts-expect-error TS7016: Could not find a declaration file for module '@tailwindcss/vite'.
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import * as vite from 'vite';
import istanbul from 'vite-plugin-istanbul';
import svgr from 'vite-plugin-svgr';

const rootDirname = process.cwd();
const srcDirname = path.resolve(rootDirname, 'src');
const buildDirname = path.resolve(rootDirname, 'build');

const withCoverage = process.env.VITE_COVERAGE === 'true';

const getMaxParallelFileOps = () => {
    if (process.env.MAX_PARALLEL) {
        return Number(process.env.MAX_PARALLEL);
    }

    return os.cpus().length;
};

export default vite.defineConfig(({ mode }) => {
    const production = mode === 'production';

    return {
        mode: production ? 'production' : 'development',
        base: './',
        publicDir: path.join(srcDirname, 'public'),

        appType: production ? 'custom' : 'spa',

        esbuild: {
            sourcesContent: false,
        },

        resolve: {
            alias: {
                '@': srcDirname,
            },
        },

        build: {
            sourcemap: true,
            emptyOutDir: true,
            manifest: production,
            ssrManifest: false,
            copyPublicDir: true,

            outDir: buildDirname,

            rollupOptions: {
                maxParallelFileOps: getMaxParallelFileOps(),
                input: path.resolve(srcDirname, 'index.tsx'),
                cache: !production,
            },
        },

        clearScreen: false,

        plugins: [
            svgr(),
            tailwindcss(),
            react({}),
            production
                ? visualizer({
                      template: 'treemap',
                      open: false,
                      gzipSize: true,
                      brotliSize: false,
                      filename: 'report.html',
                  })
                : null,
            production
                ? codecovVitePlugin({
                      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
                      bundleName: '@appvantageasia/console',
                      uploadToken: process.env.CODECOV_TOKEN,
                  })
                : null,
            production
                ? sentryVitePlugin({
                      org: 'appvantage',
                      project: 'starter-kit-v2',
                      authToken: process.env.SENTRY_AUTH_TOKEN,
                      telemetry: false,
                  })
                : null,
            withCoverage
                ? istanbul({
                      exclude: ['node_modules', '.storybook'],
                      forceBuildInstrument: true,
                  })
                : null,
        ].filter(Boolean),

        define: {
            __IS_BROWSER__: JSON.stringify(true),
            __IS_DEV__: JSON.stringify(!production),
        },

        json: {
            stringify: true,
        },
    };
});
