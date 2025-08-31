import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { copy } from 'fs-extra/esm';
import type { ExecuteCommandOptions } from './executeCommand.js';
import executeCommand from './executeCommand.js';
import { cwd, consoleBuildPathname, backendBuildPath } from './variables.js';

export interface Options {
    verbose?: boolean;
    appVersion: string | null;
    sentryRelease: string | null;
    tag: string | null;
    logger?: ExecuteCommandOptions['logger'];
}

const buildImage = async (options: Options) => {
    // create a temporar directory
    const buildPath = await mkdtemp(join(tmpdir(), 'starter-kit-v2-build-'));

    try {
        // first copy the required assets/files
        await copy(backendBuildPath, buildPath);
        await copy(consoleBuildPathname, join(buildPath, 'public'));
        await copy(join(consoleBuildPathname, '.vite/manifest.json'), join(buildPath, 'consoleManifest.json'));
        await copy(join(cwd, '.yarn/releases'), join(buildPath, '.yarn/releases'));
        await copy(join(cwd, '.yarnrc.yml'), join(buildPath, '.yarnrc.yml'));

        const buildOptions: ExecuteCommandOptions = {
            env: process.env,
            verbose: options.verbose,
            cwd: buildPath,
            logger: options.logger,
        };

        // prepare yarn/node dependencies
        await executeCommand('yarn', ['up', '--mode=skip-build'], buildOptions);
        await executeCommand('yarn', ['cache', 'clean'], buildOptions);
        await rm(join(buildPath, 'node_modules'), { recursive: true });

        // build docker image
        const dockerBuildArgs: string[] = ['build'];
        dockerBuildArgs.push('-f', join(cwd, 'Dockerfile'));

        if (options.appVersion) {
            dockerBuildArgs.push('--build-arg', `VERSION=${options.appVersion}`);
        }

        if (options.sentryRelease) {
            dockerBuildArgs.push('--build-arg', `SENTRY_RELEASE=${options.sentryRelease}`);
        }

        if (options.tag) {
            dockerBuildArgs.push('--tag', options.tag);
        }

        await executeCommand('docker', [...dockerBuildArgs, '.'], buildOptions);
    } finally {
        // cleanup the build directory
        await rm(buildPath, { recursive: true });
    }
};

export default buildImage;
