import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import ts from 'typescript';

const cachedPrograms: Record<string, ts.Program> = {};

export const formatHost: ts.FormatDiagnosticsHost = {
    getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
    getNewLine: () => ts.sys.newLine,
    getCanonicalFileName: ts.sys.useCaseSensitiveFileNames ? f => f : f => f.toLowerCase(),
};

export const defaultCompilerOptions: ts.CompilerOptions = {
    incremental: false,
    // ensure ".d.ts" modules are generated
    declaration: true,
    // skip ".js" generation
    noEmit: false,
    emitDeclarationOnly: true,
    // skip code generation when error occurs
    noEmitOnError: true,
    // avoid extra work
    checkJs: false,
    declarationMap: false,
    skipLibCheck: true,
    // ensure TS2742 errors are visible
    preserveSymlinks: true,
    // ensure we can parse the latest code
    target: ts.ScriptTarget.ESNext,
};

// persist configuration by path
const cachedConfig = new Map<string, ts.ParsedCommandLine>();

// function to cache a configuration and all path between it and the input dirname
const cacheConfig = ([fromPath, toPath]: [from: string, to: string], config: ts.ParsedCommandLine) => {
    while (
        fromPath !== toPath &&
        // make sure we're not stuck in an infinite loop
        fromPath !== path.dirname(fromPath)
    ) {
        fromPath = path.dirname(fromPath);

        if (cachedConfig.has(fromPath)) {
            break;
        }

        cachedConfig.set(fromPath, config);
    }
};

// get compiler options for an input
export const getCompilerOptions = (input: string): ts.CompilerOptions => {
    // first resolve the dirname by the input dirname
    let dirname = path.dirname(input);

    // if we have a cache already for this directory then skip the next block
    if (!cachedConfig.has(dirname)) {
        // find out if there is a configuration in this pathname
        const configPath = ts.findConfigFile(dirname, ts.sys.fileExists);

        if (!configPath) {
            // no configuration found so fallback on the default options
            return defaultCompilerOptions;
        }

        // resolve the dirname of the configuration and use it as key from now on
        const inputDirname = dirname;
        dirname = path.dirname(configPath);

        // read the configuration
        const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile);

        if (error) {
            // the configuration is invalid so let's fallback on default value and print errors
            console.error(ts.formatDiagnostic(error, formatHost));

            return defaultCompilerOptions;
        }

        // parse configuration and cache it
        // use PROJECT_CWD to help tsconfig.json resolution find node modules
        // this is due to being in a monorepo
        const configContents = ts.parseJsonConfigFileContent(config, ts.sys, process.env.PROJECT_CWD || dirname);

        if (configContents.errors.length > 0) {
            // handle errors the same way as before
            for (const error of configContents.errors) {
                console.error(ts.formatDiagnostic(error, formatHost));
            }

            return defaultCompilerOptions;
        }

        // finally cache it
        cacheConfig([inputDirname, dirname], configContents);
    }

    // retrieve configuration based on the resolved path
    // we are only looking for the options
    const { options } = cachedConfig.get(dirname)!;

    // override the options with our default ones to ensure behavior on our expectations
    return { ...options, ...defaultCompilerOptions };
};

export const createProgram = (file: string, useCache = false): ts.Program => {
    if (useCache && file in cachedPrograms) {
        // the TS program for this input is already in cache
        return cachedPrograms[file];
    }

    // get compiler options
    const compilerOptions = getCompilerOptions(file);
    // create a new program
    const program = ts.createProgram([file], compilerOptions, ts.createCompilerHost(compilerOptions, true));

    if (useCache) {
        // cache it for next access
        cachedPrograms[file] = program;
    }

    return program;
};

export const generateDeclarations = async (sourceFile: string, declarationFile: string) => {
    // get program and then parse the source file
    const program = createProgram(sourceFile);
    const source = program.getSourceFile(sourceFile)!;

    // text declaration will be resolved by the writeCallback on the emit method
    let declarationText: string | null = null;

    // track if errors were identified
    let hasErrors = false;

    // emit output, however nothing will be printed out since we are only looking for declaration
    // and we want to catch it to write it ourselves
    const { emitSkipped, diagnostics } = program.emit(source, (_, text) => {
        declarationText = text;
    });

    if (emitSkipped) {
        // filter to keep errors only
        const errors = diagnostics.filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error);

        if (errors.length) {
            hasErrors = true;

            // print it out properly
            errors.forEach(error => {
                const msg = `❌  ${ts.formatDiagnostic(error, formatHost)}`;
                process.stdout.write(chalk.red(msg));
            });
        }
    } else if (declarationText) {
        // write declaration file
        await fs.writeFile(declarationFile, declarationText);
    }

    return { hasErrors, declarationText };
};
