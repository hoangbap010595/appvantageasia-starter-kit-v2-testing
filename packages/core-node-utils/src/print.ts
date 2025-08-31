import type { ChalkInstance } from 'chalk';
import chalk from 'chalk';
import nodeId from './nodeId.js';

const format = (color: ChalkInstance, type: string, message: string, svc: string) =>
    `${chalk.gray(`[${new Date().toISOString()}]`)} ${color(type)}  ${chalk.gray(`${nodeId}/${svc}`)} ${message}`;

const print = {
    info: (message: string, svc = 'UNKNOWN') => console.info(format(chalk.green, 'INFO', message, svc)),
    warn: (message: string, svc = 'UNKNOWN') => console.warn(format(chalk.yellow, 'WARN', message, svc)),
    debug: (message: string, svc = 'UNKNOWN') => console.info(format(chalk.cyan, 'DEBUG', message, svc)),
    error: (message: string, svc = 'UNKNOWN') => console.error(format(chalk.red, 'ERROR', message, svc)),
};

export default print;
