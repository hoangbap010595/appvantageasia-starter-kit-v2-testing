import { sentry } from '@appvantageasia/core-broker';
import API from './API.js';
import getSettings from './getSettings.js';
import type { GetWhateverParams, GetWhateverResponse } from './types.js';

// eslint-disable-next-line import/prefer-default-export
export const getWhatever = sentry.wrapAction<GetWhateverParams, GetWhateverResponse>(async context => {
    const settings = await getSettings();

    return new API(settings).getWhatever(context.params);
});
