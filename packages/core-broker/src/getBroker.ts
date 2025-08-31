/// <reference path="../types/global.d.ts" />
import type { BrokerOptions, LogLevels } from 'moleculer';
import { ServiceBroker } from 'moleculer';
import * as config from './config.js';
import EJSONSerializer from './serializer.js';

export const getBrokerOptions = (): BrokerOptions => ({
    namespace: config.namespace,
    transporter: config.transporterUri,
    serializer: new EJSONSerializer(),
    logLevel: config.logLevel as LogLevels,
});

const getBroker = (): ServiceBroker => {
    if (!global.broker) {
        global.broker = new ServiceBroker(getBrokerOptions());
    }

    return global.broker;
};

export default getBroker;
