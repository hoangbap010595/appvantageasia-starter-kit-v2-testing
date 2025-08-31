import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as github from '@actions/github';
import { glob } from 'glob';

const projectDirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

// get information on everything
const githubToken = process.env.GITHUB_TOKEN!;

// get the octokit client
const octokit = github.getOctokit(githubToken);

const categories = [
    { name: 'ESLint Check', key: 'eslint' },
    { name: 'Typescript Check', key: 'typescript' },
];

for (const category of categories) {
    const reports = await glob(`{apps,packages,services}/*/${category.key}-report.json`, { cwd: projectDirname });

    const checkObject = {
        name: category.name,
        status: 'completed',
        conclusion: 'success',
        output: {
            title: 'Typescript validation',
            summary: 'List of typing errors found in the TypeScript codebase.',
            annotations: [] as any[],
        },
        ...github.context.repo,
        head_sha: github.context.payload.pull_request?.head.sha || github.context.sha,
    };

    await reports.reduce<Promise<void>>(async (promise, report) => {
        await promise;
        const content = await fs.readFile(path.join(projectDirname, report), 'utf-8');
        const newCheckObject = JSON.parse(content);

        if (checkObject.conclusion === 'success') {
            // override with the new conclusion
            // if we already met something other than success let's keep it as it's
            checkObject.conclusion = newCheckObject.conclusion;
        }

        // append new annotations
        checkObject.output.annotations.push(...newCheckObject.output.annotations);
    }, Promise.resolve());

    await octokit.rest.checks.create(checkObject as any);
}
