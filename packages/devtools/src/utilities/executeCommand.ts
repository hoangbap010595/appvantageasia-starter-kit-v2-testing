import type { SpawnOptions } from 'node:child_process';
import { spawn } from 'node:child_process';

export interface ExecuteCommandOptions {
    cwd: SpawnOptions['cwd'];
    env: SpawnOptions['env'];
    verbose?: boolean;
    logger?: { stdout: (message: string) => void; stderr: (message: string) => void };
}

const defaultLogger: ExecuteCommandOptions['logger'] = {
    stdout: message => process.stdout.write(message),
    stderr: message => process.stderr.write(message),
};

const executeCommand = (
    command: string,
    args: string[],
    { cwd, env, verbose = false, logger = defaultLogger }: ExecuteCommandOptions
) =>
    new Promise<void>((resolve, reject) => {
        const child = spawn(command, args, { cwd, env });

        child.stdout.on('data', data => {
            if (verbose) {
                logger.stdout(data.toString());
            }
        });

        child.stderr.on('data', data => {
            if (verbose) {
                logger.stderr(data.toString());
            }
        });

        child.on('exit', code => {
            if (code) {
                reject();
            } else {
                resolve();
            }
        });
    });

export default executeCommand;
