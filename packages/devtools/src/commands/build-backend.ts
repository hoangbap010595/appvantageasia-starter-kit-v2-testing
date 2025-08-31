import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import { Command } from 'commander';
import * as esbuild from 'esbuild';
import { rimraf } from 'rimraf';
import { getBackendBuildOptions, generatePackageFile } from '../utilities/esbuild.js';
import { getRecordTime, getTimeElapsed } from '../utilities/timers.js';

const program = new Command();

program
    .option('--clean', 'clean output directory', false)
    .option('--src <string>', 'source directory', 'src')
    .option('--out <string>', 'output directory', 'build')
    .option('--entry <string>', 'entrypoint', 'index.ts')
    .option('--with-graphql', 'enable GraphQL support', false)
    .option('--deps <string...>', 'additional dependencies', [])
    .parse();

interface Options {
    src: string;
    out: string;
    entry: string;
    clean: boolean;
    withGraphql: boolean;
    deps: string[];
}

const options = program.opts<Options>();
const cwd = process.cwd();

if (options.clean) {
    // always clean the out directory first
    await rimraf(options.out);
}

const entryPoint = path.join(cwd, options.src, options.entry);
const config = getBackendBuildOptions({
    cwd,
    outDir: path.join(cwd, options.out),
    entryPoints: [entryPoint],
    production: true,
    withGraphql: options.withGraphql,
});

const startTime = getRecordTime();
const results = await esbuild.build(config);
console.info(chalk.green(`✅  Build completed in ${getTimeElapsed(startTime)} ms`));

//  and generate package file
const packageContent = await generatePackageFile(path.relative(cwd, entryPoint), results, options.deps);
await fs.writeFile(path.join(cwd, options.out, 'package.json'), JSON.stringify(packageContent, null, 2));
console.info(chalk.green('✅  Generation of package.json'));
