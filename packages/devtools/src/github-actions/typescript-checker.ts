import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as core from '@actions/core';
import type { RestEndpointMethodTypes } from '@octokit/rest';
import ts from 'typescript';

const isCi = !!process.env.CI;

const workingDirectory = process.cwd();

const projectDirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

const { name } = await fs.readFile(path.resolve(workingDirectory, 'package.json'), 'utf-8').then(JSON.parse);

// Load TypeScript configuration
const tsConfigPath = ts.findConfigFile(workingDirectory, existsSync, 'tsconfig.json');

if (!tsConfigPath) {
    core.warning(`Could not find tsconfig.json in ${workingDirectory}`);

    process.exit(0);
}

const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(tsConfigPath, {}, ts.sys as any);

if (!parsedCommandLine) {
    core.warning(`Could not load tsconfig.json from path ${tsConfigPath}`);

    process.exit(0);
}

// Override the noEmit option to true
parsedCommandLine.options.noEmit = true;
parsedCommandLine.options.emitDeclarationOnly = false;

// Create the program
const tsProgram = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);

// Perform type checking
const emitResult = tsProgram.emit();
const allDiagnostics = ts.getPreEmitDiagnostics(tsProgram).concat(emitResult.diagnostics);

if (!isCi && allDiagnostics.length > 0) {
    console.info(
        ts.formatDiagnosticsWithColorAndContext(allDiagnostics, ts.createCompilerHost(parsedCommandLine.options))
    );
}

type Annotations = NonNullable<
    NonNullable<NonNullable<RestEndpointMethodTypes['checks']['create']['parameters']>['output']>['annotations']
>;

const annotations: Annotations = [];

allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
        const fileName = path.relative(projectDirname, diagnostic.file.fileName);
        const { line } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
        const body = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

        annotations.push({
            path: fileName,
            start_line: line + 1,
            end_line: line + 1,
            annotation_level: 'failure',
            message: body,
        });
    }
});

const report = {
    name: `Typescript Validation - ${name}`,
    status: 'completed',
    conclusion: annotations.length > 0 ? 'failure' : 'success',
    output: {
        title: 'Typescript validation',
        summary: 'List of typing errors found in the TypeScript codebase.',
        annotations,
    },
    generatedAt: new Date(),
};

await fs.writeFile(path.join(workingDirectory, 'typescript-report.json'), JSON.stringify(report));

if (annotations.length > 0) {
    console.info(ts.formatDiagnostics(allDiagnostics, ts.createCompilerHost(parsedCommandLine.options)));
    process.exit(1);
} else {
    process.exit(0);
}
