import { createCalls, process } from '@appvantageasia/core-bull';
import type { JobPayload } from './handler.js';

export const setupProcess = () => {
    return process<JobPayload>('sendTwoFactorUpdate', (...args) =>
        import('./handler.js').then(({ default: handler }) => handler(...args))
    );
};

const job = createCalls<JobPayload>('sendTwoFactorUpdate');

const sendTwoFactorUpdate = (params: JobPayload) => job.call(params);

export default sendTwoFactorUpdate;
