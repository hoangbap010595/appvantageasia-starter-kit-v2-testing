import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import { watch } from 'chokidar';
import { Command } from 'commander';
import * as esbuild from 'esbuild';
import { glob } from 'glob';
import { rimraf } from 'rimraf';
import { getRecordTime, getTimeElapsed } from '../utilities/timers.js';
import { generateDeclarations } from '../utilities/typescript.js';

const program = new Command();

program
    .option('--clean', 'clean output directory', false)
    .option('--src <string>', 'source directory', 'src')
    .option('--watch', 'watch for changes and rebuild', false)
    .option('--out <string>', 'output directory', 'build')
    .parse();

interface Options {
    src: string;
    watch: boolean;
    out: string;
    clean: boolean;
}

const options = program.opts<Options>();

if (options.clean) {
    await rimraf(options.out);
}

const buildFile = async (file: string) => {
    const startTime = getRecordTime();

    const filePath = path.relative(options.src, file);
    const output = await esbuild.build({
        entryPoints: [file],
        bundle: false,
        write: true,
        target: 'node18',
        format: 'esm',
        outdir: path.join(options.out, path.dirname(filePath)),
        sourcemap: 'external',
        metafile: false,
    });

    if (output.errors.length > 0) {
        console.info(chalk.red(`❌  ${filePath} ${getTimeElapsed(startTime)} ms`));
        output.errors.forEach(error => console.error(chalk.red(error.text)));

        return false;
    }

    const declarationFile = path.join(
        options.out,
        path.dirname(filePath),
        `${path.basename(file, path.extname(file))}.d.ts`
    );

    const { hasErrors } = await generateDeclarations(file, declarationFile);
    console.info(chalk.green(`✅  ${filePath} ${getTimeElapsed(startTime)} ms`));

    return !hasErrors;
};

const deleteFileOutput = async (file: string | Error) => {
    if (typeof file !== 'string') {
        console.info(chalk.red(`❌  ${file.message}`));

        return;
    }

    // get the dirname for this file
    const dirname = path.relative(options.src, path.dirname(file));

    // get the filename without the extensions at the end
    const extname = path.extname(file);

    if (['.ts', '.tsx', '.js', '.jsx'].includes(extname)) {
        // we need to delete output files
        const filename = path.basename(file, extname);

        await ['.js', '.d.ts', '.js.map'].reduce<Promise<unknown>>(async (acc, ext) => {
            const fileToRemove = path.join(options.out, dirname, `${filename}${ext}`);

            if (existsSync(fileToRemove)) {
                await fs.unlink(fileToRemove);
            }
        }, Promise.resolve());
    }
};

const isBuildSuccessful = await glob(`${options.src}/**/*.{js,jsx,ts,tsx}`, { ignore: ['**/*.d.ts'] }).then(files =>
    files.reduce<Promise<boolean>>(
        (acc, file) => acc.then(async acc => (await buildFile(file)) && acc),
        Promise.resolve(true)
    )
);

if (options.watch) {
    let latestPromise: Promise<unknown> | null = null;

    const chain = (file: string | Error) => {
        if (typeof file !== 'string') {
            console.info(chalk.red(`❌  ${file.message}`));

            return;
        }

        let promise: Promise<unknown> = latestPromise ? latestPromise.then(() => buildFile(file)) : buildFile(file);

        promise = promise
            // nullify errors
            .catch(() => null)
            .finally(() => {
                if (promise === latestPromise) {
                    latestPromise = null;
                }
            });

        latestPromise = promise;
    };

    watch(options.src, { ignoreInitial: true }).on('add', chain).on('change', chain).on('unlink', deleteFileOutput);
} else {
    if (!isBuildSuccessful) {
        console.info(chalk.red('❌  Build failed'));
    }

    process.exit(isBuildSuccessful ? 0 : 1);
}
