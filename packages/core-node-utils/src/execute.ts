import { spawn, type SpawnOptionsWithoutStdio } from 'node:child_process';

const execute = (command: string, args: string[], options?: SpawnOptionsWithoutStdio & { verbose?: boolean }) =>
    new Promise<void>((resolve, reject) => {
        const { verbose = false, ...spawnOptions } = options || {};
        const child = spawn(command, args, spawnOptions);

        child.stdout.on('data', data => {
            if (verbose) {
                process.stdout.write(data.toString());
            }
        });

        child.stderr.on('data', data => {
            if (verbose) {
                process.stderr.write(data.toString());
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

export default execute;
