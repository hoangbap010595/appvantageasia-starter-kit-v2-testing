import { createCalls, process } from '@appvantageasia/core-bull';
import type { JobPayload } from './handler.js';

export const setupProcess = () => {
    return process<JobPayload>('sendResetPassword', (...args) =>
        import('./handler.js').then(({ default: handler }) => handler(...args))
    );
};

const job = createCalls<JobPayload>('sendResetPassword');

const sendResetPassword = (params: JobPayload) => job.call(params);

export default sendResetPassword;
