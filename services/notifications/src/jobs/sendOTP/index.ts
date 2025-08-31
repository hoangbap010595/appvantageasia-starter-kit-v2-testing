import { createCalls, process } from '@appvantageasia/core-bull';
import type { JobPayload } from './handler.js';

export const setupProcess = () => {
    return process<JobPayload>('sendOTP', (...args) =>
        import('./handler.js').then(({ default: handler }) => handler(...args))
    );
};

const job = createCalls<JobPayload>('sendOTP');

const sendOTP = (params: JobPayload) => job.call(params);

export default sendOTP;
