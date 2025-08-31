import { getBroker, sentry } from '@appvantageasia/core-broker';
import type { GetWhateverParams, GetWhateverResponse } from './types.js';

const getInterface = (broker = getBroker()) => ({
    // get whatever
    getWhatever: sentry.wrapInterface<GetWhateverParams, GetWhateverResponse>(broker, 'vendor_dummy.getWhatever'),
});

export default getInterface;

export type Interface = ReturnType<typeof getInterface>;
