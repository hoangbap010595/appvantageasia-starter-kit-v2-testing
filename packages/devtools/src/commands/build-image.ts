import { Command } from 'commander';
import type { Options } from '../utilities/build-image.js';
import buildImage from '../utilities/build-image.js';

const program = new Command();

program
    .option('--sentry-release', 'Sentry release to define in the docker image', 'starter-kit-v2@0.0.0')
    .option('--app-version', 'Version number to define in the docker image', '0.0.0')
    .option('--verbose', 'Verbose output', false)
    .option('--tag', 'Image docker tag', 'apv-starter-kit-v2:local')
    .parse();

const options = program.opts<Options>();

await buildImage(options);
