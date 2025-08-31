import { createReadStream } from 'fs';
import { join } from 'path';
import * as actions from '@actions/core';
import * as s3 from '@aws-sdk/client-s3';
import SentryCli from '@sentry/cli';
import { glob } from 'glob';
import mime from 'mime-types';
import fetch from 'node-fetch';
import type { VerifyConditionsContext, PrepareContext, PublishContext, SuccessContext } from 'semantic-release';
import buildImage from '../utilities/build-image.js';
import type { ExecuteCommandOptions } from '../utilities/executeCommand.js';
import executeCommand from '../utilities/executeCommand.js';
import { consoleBuildPathname, backendBuildPath } from '../utilities/variables.js';

interface PluginConfig {
    image: string;
    verbose?: boolean;
    sentry_organization: string;
    sentry_project: string;
    assets_bucket_name: string;
}

export const verifyConditions = async (pluginConfig: PluginConfig) => {
    if (!pluginConfig.image) {
        throw new Error('Image is missing in plugin configuration');
    }

    if (!pluginConfig.sentry_organization) {
        throw new Error('Sentry organization is missing in plugin configuration');
    }

    if (!pluginConfig.sentry_project) {
        throw new Error('Sentry project is missing in plugin configuration');
    }

    if (!process.env.SENTRY_AUTH_TOKEN) {
        throw new Error('Sentry auth token is missing in environment variables');
    }

    if (!pluginConfig.assets_bucket_name) {
        throw new Error('Assets bucket name is missing in plugin configuration');
    }

    if (!process.env.MST_RELEASES_WEBHOOK) {
        throw new Error('MST releases webhook is missing in environment variables');
    }

    if (!process.env.GITHUB_REPOSITORY) {
        throw new Error('GitHub repository is missing in environment variables');
    }
};

const getBuildLogger = (logger: VerifyConditionsContext['logger']): ExecuteCommandOptions['logger'] => ({
    stdout: message => logger.log(message),
    stderr: message => logger.error(message),
});

const getBuildOptions = (
    pluginConfig: PluginConfig,
    context: PrepareContext | SuccessContext
): ExecuteCommandOptions => ({
    env: { ...process.env, SEM_NEXT_VERSION: context.nextRelease.version },
    verbose: pluginConfig.verbose || actions.isDebug() || true, // todo remove this later
    cwd: process.cwd(),
    logger: getBuildLogger(context.logger),
});

const getSentryCli = (pluginConfig: PluginConfig) =>
    new SentryCli(undefined, {
        silent: !(pluginConfig.verbose || actions.isDebug()),
        org: pluginConfig.sentry_organization,
        project: pluginConfig.sentry_project,
        authToken: process.env.SENTRY_AUTH_TOKEN,
    });

export const prepare = async (pluginConfig: PluginConfig, context: PrepareContext) => {
    const { lastRelease, nextRelease } = context;
    const buildOptions: ExecuteCommandOptions = getBuildOptions(pluginConfig, context);

    if (lastRelease.version) {
        // pull previous version
        const latestImage = `${pluginConfig.image}:${lastRelease.version}`;

        try {
            await executeCommand('docker', ['pull', latestImage], buildOptions);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            buildOptions.logger?.stderr('Failed to pull image for previous version');
        }
    }

    // build image for next version
    const { version } = nextRelease;
    const sentryReleaseName = `${pluginConfig.sentry_project}@${version}`;
    await buildImage({
        verbose: pluginConfig.verbose || actions.isDebug(),
        appVersion: version,
        sentryRelease: sentryReleaseName,
        tag: `${pluginConfig.image}:${version}`,
        logger: buildOptions.logger,
    });

    // create the sentry release
    const cli = getSentryCli(pluginConfig);
    await cli.releases.new(sentryReleaseName);

    // upload source maps
    await cli.releases.uploadSourceMaps(sentryReleaseName, { include: [consoleBuildPathname], dist: 'console' });
    await cli.releases.uploadSourceMaps(sentryReleaseName, { include: [backendBuildPath], dist: 'backend' });

    // attach commits
    const { gitHead: commit } = nextRelease;
    const { gitHead: previousCommit } = lastRelease;
    await cli.releases.setCommits(sentryReleaseName, { commit, previousCommit, repo: process.env.GITHUB_REPOSITORY! });
};

export const publish = async (pluginConfig: PluginConfig, context: PublishContext) => {
    const { nextRelease } = context;
    const buildOptions: ExecuteCommandOptions = getBuildOptions(pluginConfig, context);
    const { version } = nextRelease;

    // publish to S3 for CDN serving
    const client = new s3.S3Client({});
    const assets = await glob('**/*', { cwd: consoleBuildPathname, nodir: true });

    await assets.reduce<Promise<unknown>>(
        (acc, filename) =>
            acc.then(() =>
                client
                    .send(
                        new s3.PutObjectCommand({
                            Bucket: pluginConfig.assets_bucket_name,
                            Key: `${version}/${filename}`,
                            Metadata: { version },
                            ContentType: mime.lookup(filename) as string,
                            Body: createReadStream(join(consoleBuildPathname, filename)),
                        })
                    )
                    .then(() => {
                        buildOptions.logger?.stdout(`Uploaded ${filename}`);
                    })
                    .catch(async error => {
                        buildOptions.logger?.stderr(`Failed to upload ${filename} to S3 bucket`);
                        throw error;
                    })
            ),
        Promise.resolve()
    );

    // publish image
    await executeCommand('docker', ['push', `${pluginConfig.image}:${version}`], buildOptions);

    // finalize the release
    const sentryReleaseName = `${pluginConfig.sentry_project}@${version}`;
    const cli = getSentryCli(pluginConfig);
    await cli.releases.finalize(sentryReleaseName);
};

export const success = async (pluginConfig: PluginConfig, context: SuccessContext) => {
    const { nextRelease, logger } = context;
    const { version, type, notes } = nextRelease;

    // notify MST releases
    const response = await fetch(process.env.MST_RELEASES_WEBHOOK!, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
            type: 'message',
            attachments: [
                {
                    contentType: 'application/vnd.microsoft.card.adaptive',
                    contentUrl: null,
                    content: {
                        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                        type: 'AdaptiveCard',
                        version: '1.5',
                        body: [
                            {
                                type: 'FactSet',
                                facts: [
                                    { title: 'Repository', value: process.env.GITHUB_REPOSITORY! },
                                    { title: 'Version', value: version },
                                    { title: 'Type', value: type },
                                ],
                            },
                            {
                                type: 'TextBlock',
                                text: notes!
                                    .split('\n')
                                    .slice(3)
                                    .join('\n')
                                    .replaceAll(/### (.+)/gm, (substring, content) => `**${content}**`),
                            },
                        ],
                        actions: [
                            {
                                type: 'Action.OpenUrl',
                                title: 'Storybook',
                                url: `https://d25vi1gzjofznn.cloudfront.net/storybook/${version}/index.html`,
                            },
                        ],
                    },
                },
            ],
        }),
    });

    logger.log(`Notified MST releases: ${response.status} ${response.statusText}`);

    // github actions outputs
    actions.setOutput('nextRelease', version);
    actions.notice(`Published version ${version}`);
};
