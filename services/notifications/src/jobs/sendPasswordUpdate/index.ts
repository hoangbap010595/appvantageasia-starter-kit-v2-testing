import { createCalls, process } from '@appvantageasia/core-bull';
import type { JobPayload } from './handler.js';

export const setupProcess = () => {
    return process<JobPayload>('sendPasswordUpdate', (...args) =>
        import('./handler.js').then(({ default: handler }) => handler(...args))
    );
};

const job = createCalls<JobPayload>('sendPasswordUpdate');

const sendPasswordUpdate = (params: JobPayload) => job.call(params);

export default sendPasswordUpdate;
