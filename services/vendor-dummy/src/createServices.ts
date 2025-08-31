import { getBroker } from '@appvantageasia/core-broker';

const createServices = async (broker = getBroker()) => {
    const actions = await import('./actions.js');

    broker.createService({
        name: 'vendor_dummy',
        actions: {
            getWhatever: actions.getWhatever,
        },
    });

    return broker;
};

export default createServices;
