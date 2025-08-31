import type { ChildProcess } from 'node:child_process';
import { fork } from 'node:child_process';
import path from 'node:path';
import chalk from 'chalk';
import { watch } from 'chokidar';
import { Command } from 'commander';
import * as esbuild from 'esbuild';
import { rimraf } from 'rimraf';
import sourceMapSupport from 'source-map-support';
import { getBackendBuildOptions, getBackendEntrypoint } from '../utilities/esbuild.js';
import loadEnvironment from '../utilities/loadEnvironment.js';

const program = new Command();

program
    .option('--src <string>', 'source directory', 'src')
    .option('--out <string>', 'output directory', 'build')
    .option('--entry <string>', 'entrypoint', 'index.ts')
    .option('--with-graphql', 'enable GraphQL support', false)
    .parse();

interface Options {
    src: string;
    out: string;
    entry: string;
    withGraphql: boolean;
}

const options = program.opts<Options>();
const cwd = process.cwd();

// always clean the out directory first
await rimraf(options.out);

// set source map support for debugging
sourceMapSupport.install({ hookRequire: true, environment: 'node' });

// load environment for development
process.env.NODE_ENV = 'development';
const baseEnv = { ...process.env };
const { loadedEnvFiles } = loadEnvironment(cwd, 'development', true, baseEnv);

const initialEntryPoint = path.join(cwd, options.src, options.entry);

let initializeChain: Promise<void> | null = null;
let currentEntrypoint: string | null = null;
let currentChildProcess: ChildProcess | null = null;
let currentChildClosePromise: Promise<void> | null = null;

const runBuild = async (entrypoint: string) => {
    const execute = async () => {
        if (currentChildProcess) {
            // kill the current child
            console.info(chalk.cyan(`⌛  Killing current child..`));
            currentChildProcess.kill(currentChildProcess.killed ? 'SIGKILL' : 'SIGTERM');
            await currentChildClosePromise;
        }

        if (currentEntrypoint !== entrypoint) {
            // skip this execution because the bundle is outdated
            return;
        }

        // create a new promise to wait for the child process to close
        let closeResolver: (() => void) | null = null;
        currentChildClosePromise = new Promise<void>(resolve => {
            closeResolver = resolve;
        });

        // start a new child
        console.info(chalk.cyan(`⌛  Forking..`));
        currentChildProcess = fork(path.join(cwd, entrypoint), {
            env: process.env,
            execArgv: ['--enable-source-maps'],
        });

        currentChildProcess.on('spawn', () => {
            console.info(chalk.cyan(`⌛  Spawning backend..`));
        });

        currentChildProcess.on('close', code => {
            if (code) {
                console.warn(chalk.yellow(`⚠️ child process exited with ${code}`));
                console.warn(chalk.yellow('⚠️ setup stopped to avoid infinite forks, make changes to proceed'));
            } else {
                console.warn(chalk.yellow(`⚠️ child process exited successfully`));
            }

            if (closeResolver) {
                // resolve the promise
                closeResolver();
            }

            // reset child variables to null
            currentChildProcess = null;
            closeResolver = null;
            currentChildClosePromise = null;
        });

        if (currentEntrypoint === entrypoint) {
            // the chain is completed
            initializeChain = null;
        }
    };

    if (initializeChain) {
        console.info(chalk.cyan(`⌛  Pending in initialization queue..`));

        return initializeChain.then(execute);
    }

    initializeChain = execute();

    return initializeChain;
};

const customWatchPlugin: esbuild.Plugin = {
    name: 'CustomWatchPlugin',
    setup(build) {
        build.onStart(() => {
            console.info(chalk.cyan('⌛  Build ongoing..'));
        });

        build.onEnd(result => {
            if (result.errors?.length) {
                console.error(chalk.red('🔴 Build failed'));
                result.errors.forEach(error => console.error(error));
            } else {
                console.info(chalk.cyan('✅  Build completed..'));
                // get the entrypoint for this build
                const entrypoint = getBackendEntrypoint(path.relative(cwd, initialEntryPoint), result);
                // update singleton variable
                currentEntrypoint = entrypoint;
                // run the entrypoint
                runBuild(entrypoint).catch(error => {
                    chalk.red(`🔴 An error happened with the server bundle`);
                    console.error(error);
                });
            }
        });
    },
};

const config = getBackendBuildOptions({
    cwd,
    outDir: path.join(cwd, options.out),
    entryPoints: [initialEntryPoint],
    production: false,
    withGraphql: options.withGraphql,
});

const context = await esbuild.context({
    ...config,
    plugins: [...(config.plugins || []), customWatchPlugin],
});

await context.watch();

const envWatcher = watch(loadedEnvFiles.map(envFile => envFile.path));

envWatcher.on('change', () => {
    if (currentEntrypoint) {
        console.warn(chalk.yellow(`⚠️ Environment files changed`));
        // reload environment
        loadEnvironment(cwd, 'development', false, baseEnv);
        // then restart the latest build output
        runBuild(currentEntrypoint);
    }
});

const stopRun = async () => {
    if (currentChildProcess) {
        currentChildProcess.kill('SIGINT');
    }

    await envWatcher.close();
    await context.dispose();
    process.exit(0);
};

process.on('SIGINT', stopRun);
process.on('SIGTERM', stopRun);
