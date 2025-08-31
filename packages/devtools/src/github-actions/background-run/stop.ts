import fs from 'node:fs';
import { kill } from 'node:process';
import * as core from '@actions/core';
import chalk from 'chalk';
import { Command } from 'commander';
import wrapTail from './wrapTail.js';

const program = new Command();

program
    .option('--pid <string>', 'process id')
    .option('--std-out-file <string>', 'standard output file', '')
    .option('--timeout <string>', 'timeout', '30')
    .option('--send-sigkill', 'send SIGKILL', false)
    .parse();

interface Options {
    pid: string;
    stdOutFile: string;
    timeout: string;
    sendSigkill: boolean;
}

const options = program.opts<Options>();

if (options.pid) {
    const pid = parseInt(options.pid, 10);
    const getStdout = options.stdOutFile ? wrapTail(options.stdOutFile, core.info) : null;

    if (options.stdOutFile && !fs.existsSync(options.stdOutFile)) {
        core.warning(`File ${options.stdOutFile} does not exist`);
    }

    try {
        core.info(chalk.red(`Killing process ${pid}`));
        kill(pid, 'SIGTERM');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    await new Promise<void>(resolve => {
        const timeout = parseInt(options.timeout, 10);
        let tries = 1;
        const interval = setInterval(() => {
            try {
                if (timeout && tries > timeout) {
                    throw new Error('Process did not terminate');
                }

                const sendSigKill = options.sendSigkill && tries++ % 10 === 0;

                // process.kill sends the signal but does not terminate the process
                // A signal of 0 can be used to test for the existence of a process
                kill(pid, sendSigKill ? 'SIGKILL' : 0);

                core.info(
                    chalk.red(
                        sendSigKill ? `Send killing signal to process ${pid}` : `Process ${pid} is still running...`
                    )
                );
            } catch {
                clearInterval(interval);
                // if an error is thrown, it means the process is not running
                resolve();
                core.info(chalk.red(`Process ${pid} has been terminated`));
            }
        }, 1000);
    });

    if (getStdout) {
        const tail = getStdout();

        if (tail) {
            tail.unwatch();
        }
    }
} else if (options.stdOutFile) {
    const streamLog = (path: string) =>
        new Promise((resolve, reject) => {
            const log = fs.createReadStream(path, { start: 0, emitClose: true, encoding: 'utf8', autoClose: true });
            log.on('close', () => resolve(null));
            log.on('error', err => reject(err));
            log.pipe(process.stdout);
        });

    await streamLog(options.stdOutFile);
}

process.exit(0);
