import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Endpoints } from '@octokit/types';
import type { ESLint } from '@typescript-eslint/utils/ts-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectDirname = path.resolve(__dirname, '../../../');

type Annotation = NonNullable<
    NonNullable<Endpoints['POST /repos/{owner}/{repo}/check-runs']['parameters']['output']>['annotations']
>[number];

const formatter = async (results: ESLint.LintResult[], context: any) => {
    const packageRaw = await fs.readFile(path.join(context.cwd, 'package.json'), 'utf8');
    const packageName = JSON.parse(packageRaw).name as string;

    // list annotations
    const annotations: Annotation[] = [];
    let failed = false;
    results.forEach(result => {
        if (result.messages.length > 0) {
            if (result.fatalErrorCount > 0) {
                failed = true;
            }

            const filePath = path.relative(projectDirname, result.filePath);
            result.messages.forEach(message => {
                console.info(message);
                annotations.push({
                    path: filePath,
                    start_line: message.line!,
                    end_line: message.endLine || message.line!,
                    annotation_level: message.severity === 2 ? 'failure' : 'warning',
                    message: message.message,
                });
            });
        }
    });

    const output = path.join(context.cwd, 'eslint-report.json');
    await fs.writeFile(
        output,
        JSON.stringify({
            name: `ESLint Validation - ${packageName}`,
            status: 'completed',
            conclusion: failed ? 'failure' : 'success',
            output: {
                title: 'ESLint Validation',
                summary: 'List of errors and warnings found in the codebase.',
                annotations,
            },
        })
    );

    return `Write output to ${output}`;
};

export default formatter;
