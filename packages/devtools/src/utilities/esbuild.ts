/// <reference types="../../types/deps.d.ts" />
import { exec } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { builtinModules, createRequire } from 'node:module';
import path from 'node:path';
import { URL } from 'node:url';
import graphqlLoaderPlugin from '@luckycatfactory/esbuild-graphql-loader/lib/index.mjs';
import { sentryEsbuildPlugin } from '@sentry/esbuild-plugin';
import type * as esbuild from 'esbuild';
import copy from 'esbuild-plugin-copy-watch';
import semver from 'semver';
import forEachParallel from './forEachParallel.js';

export interface BackendBuildOptions {
    entryPoints: string[];
    cwd: string;
    outDir: string;
    production?: boolean;
    withGraphql?: boolean;
}

// cannot use import.meta.resolve as it remains an experimental feature
const require = createRequire(import.meta.url);

if (!process.env.PROJECT_CWD) {
    throw new Error('PROJECT_CWD is not defined, please make sure to execute this script with yarn');
}

const project = await readFile(path.resolve(process.env.PROJECT_CWD!, 'package.json'), 'utf-8').then(JSON.parse);
const projectNamespaceRegexp = new RegExp(`^${project.name.split('/')[0]}/`);

export const bundleInternalPackagesPlugin: esbuild.Plugin = {
    name: 'bundleInternalPackagesPlugin',
    setup(build) {
        // we are looking for internal packages
        // those are packages that are not external and are prefixed with the project namespace used in the root package
        build.onResolve({ filter: projectNamespaceRegexp }, async args => ({
            external: false,
            path: require.resolve(args.path),
        }));
    },
};

export const getBackendBuildOptions = (options: BackendBuildOptions): esbuild.BuildOptions => ({
    // define entry points and output names
    // development will provide names with hashes
    entryPoints: options.entryPoints,
    entryNames: options.production ? '[dir]/index' : '[dir]/index-[hash]',

    // also provide chunk names, always use hashes for those
    chunkNames: 'chunks/[name]-[hash]',

    // we are looking for bundling
    bundle: true,

    // only minify for production
    minify: !!options.production,

    // tree shaking and source maps are always provided
    treeShaking: true,
    sourcemap: true,

    // initialize plugins
    plugins: [
        bundleInternalPackagesPlugin,
        // graphql loader to load the schema for apollo
        // @ts-expect-error This expression is not callable
        options.withGraphql && graphqlLoaderPlugin(),
        // copy public/static assets
        copy({
            paths: [{ from: 'public/**', to: path.resolve(options.outDir, 'public') }],
        }),
        // sentry sourcemap uploads
        options.production &&
            sentryEsbuildPlugin({
                org: 'appvantage',
                project: 'starter-kit-v2',
                authToken: process.env.SENTRY_AUTH_TOKEN,
            }),
    ].filter(Boolean),

    // all packages are externals
    packages: 'external',

    // keep JSX to automatic mode
    jsx: 'automatic',

    // targetted plartform is NodeJS
    platform: 'node',

    // specify the output directory
    outdir: options.outDir,

    // use custom tsconfig for build
    tsconfig: path.resolve(options.cwd, 'tsconfig.json'),

    // JS target
    target: 'node22',

    // we are looking to build for ESM
    format: 'esm',

    // enable splitting for memory optimization
    splitting: true,

    // metafile is always required
    metafile: true,

    // globally replace some statements
    define: {
        __IS_BROWSER__: JSON.stringify(false),
        __IS_DEV__: JSON.stringify(!options.production),
    },
});

export const getBackendEntrypoint = (entryPoint: string, buildResults: esbuild.BuildResult) => {
    const entryPointPath = `/${entryPoint.replaceAll('\\', '/')}`;
    const result = // look for the output chunk that matches our entrypoint and return the output name
        Object.entries(buildResults.metafile?.outputs || {}).find(([, meta]) => {
            if (!meta.entryPoint) {
                return false;
            }

            return new URL(meta.entryPoint, 'file://').pathname === entryPointPath;
        });

    if (!result) {
        throw new Error('Entrypoint not found in build result');
    }

    return result[0];
};

type PackageDependencies = Record<string, string>;

const getPackageFromImportedPath = (importedPath: string) => {
    if (importedPath[0] === '@') {
        return importedPath.split('/').slice(0, 2).join('/');
    }

    return importedPath.split('/')[0];
};

const getDependencyVersion = async (packageName: string) =>
    new Promise<string>((resolve, reject) => {
        exec(`yarn why ${packageName} --json`, (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                try {
                    const version = stdout
                        .split('\n')
                        .filter(Boolean)
                        .map(resolution => JSON.parse(resolution))
                        .flatMap(resolution => Object.keys(resolution.children))
                        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                        .map(child => /(.+)[@|#]npm:(?<version>.+)/.exec(child)?.groups?.version!)
                        .reduce<null | string>(
                            (highestVersion, version) =>
                                semver.valid(version) && (highestVersion === null || semver.gt(version, highestVersion))
                                    ? version
                                    : highestVersion,
                            null
                        );

                    resolve(version!);
                } catch (processingError) {
                    reject(processingError);
                }
            }
        });
    });

export const getPackageMeta = async (buildResults: esbuild.BuildResult, additionalDependencies: string[] = []) => {
    // prepare an object to keep track of all imported external dependencies
    const requestedDependencies: PackageDependencies = Object.fromEntries(
        additionalDependencies.map(dependency => [dependency, ''])
    );

    // run through each output chunk and their meta data to list imported statements
    Object.values(buildResults.metafile?.outputs ?? {})
        .flatMap(meta => meta.imports)
        .forEach(imported => {
            // only look for external dependency
            if (imported.external) {
                // resolve the package name from the path
                const packageName = getPackageFromImportedPath(imported.path);

                if (
                    // exclude node imports with ESM syntax
                    !packageName.startsWith('node:') &&
                    // exclude built-in modules
                    !builtinModules.includes(packageName) &&
                    // exclude dependencies already tracked
                    !(packageName in requestedDependencies)
                ) {
                    // add the dependency to the package
                    requestedDependencies[packageName] = '';
                }
            }
        });

    // resolve versions to install
    await forEachParallel(Object.keys(requestedDependencies), async packageName => {
        requestedDependencies[packageName] = await getDependencyVersion(packageName);
        console.info(`Resolved version for ${packageName}: ${requestedDependencies[packageName]}`);
    });

    // we are done but first we want to sort the dependencies by name to have a consistent output
    return Object.keys(requestedDependencies)
        .sort()
        .reduce<PackageDependencies>(
            (acc, packageName) => ({
                ...acc,
                [packageName]: requestedDependencies[packageName],
            }),
            {}
        );
};

export const generatePackageFile = async (
    entryPoint: string,
    results: esbuild.BuildResult,
    additionalDependencies: string[] = []
) => ({
    // this is a private package
    private: true,
    // enable ESM
    type: 'module',
    // get the name and version from options
    name: project.name,
    version: '0.0.0-development',
    // sort our dependencies to make things cleaner
    dependencies: await getPackageMeta(results, additionalDependencies),
    scripts: {
        // the start script
        start: `node ${getBackendEntrypoint(entryPoint, results)}`,
    },
});
