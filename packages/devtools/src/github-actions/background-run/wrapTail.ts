import * as core from '@actions/core';
import { Tail } from 'tail';

const wrapTail = (filename: string, output: (message: string) => void) => {
    let value: Tail | false = false;

    const interval = setInterval(() => {
        try {
            const tail = new Tail(filename, { fromBeginning: true });
            tail.on('line', output);
            tail.on('error', core.warning);
            value = tail;
            clearInterval(interval);
        } catch {
            console.warn('background-action tried to tail a file before it was ready....');
        }
    }, 1000);

    return () => value;
};

export default wrapTail;
