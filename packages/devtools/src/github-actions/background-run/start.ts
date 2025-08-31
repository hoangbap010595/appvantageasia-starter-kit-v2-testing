import type { SpawnOptions } from 'node:child_process';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import * as core from '@actions/core';
import { Command } from 'commander';
import { nanoid } from 'nanoid';
import parseDuration from 'parse-duration';
import doWaitOn from 'wait-on';
import wrapTail from './wrapTail.js';

const program = new Command();

program
    .option('--cmd <string>', 'command to run')
    .option('--cwd <string>', 'working directory', process.env.GITHUB_WORKSPACE || './')
    .option('--log-output', 'log output', false)
    .option('--wait-for <string>', 'wait for resources', '30s')
    .option('--wait-on <string>', 'wait on resources', '')
    .parse();

interface Options {
    cmd: string;
    logOutput: boolean;
    cwd: string;
    waitFor: string;
    waitOn: string;
}

const options = program.opts<Options>();

if (core.isDebug()) {
    console.info(process.env);
}

const logId = nanoid();
const cwd = options.cwd.startsWith('/') ? options.cwd : path.resolve(process.cwd(), options.cwd);
const stdOutputFile = path.join(cwd, `${logId}.out`);
core.setOutput('stdOutputFile', stdOutputFile);

const stdOut = fs.openSync(stdOutputFile, 'a');
const stdErr = fs.openSync(stdOutputFile, 'a');
const spawnOpts: SpawnOptions = {
    detached: true,
    cwd,
    stdio: ['ignore', stdOut, stdErr],
};

const getStdout = wrapTail(stdOutputFile, core.info);

const exitHandler = async (error?: Error) => {
    const stdout = getStdout();

    if (stdout && stdout.unwatch) {
        stdout.unwatch();
    }

    if (error) {
        core.error(error);
        core.setFailed(error.message);
    }

    process.exit(error ? 1 : 0);
};

const [command, ...args] = options.cmd.match(/(?:[^\s"]+|"[^"]*")+/g)!;
const shell = spawn(command, args, spawnOpts);
shell.on('message', console.info);
shell.on('error', error => exitHandler(error));
shell.on('close', exitStatus => exitHandler(exitStatus ? new Error('Exited early') : undefined));
core.setOutput('pid', shell.pid);

if (options.waitOn) {
    const timeout = parseDuration(options.waitFor);

    if (!timeout) {
        console.error('invalid waiting for option');
        process.exit(1);
    }

    doWaitOn(
        {
            resources: options.waitOn
                .split(/\n|,/)
                .map(resource => resource.trim())
                .filter(line => line !== ''),
            timeout,
            verbose: core.isDebug(),
            log: false,
        },
        error => exitHandler(error)
    );
} else {
    process.exit(0);
}
