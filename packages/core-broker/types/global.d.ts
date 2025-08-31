/* eslint-disable no-var */
import type { ServiceBroker } from 'moleculer';

declare global {
    namespace globalThis {
        var broker: ServiceBroker | undefined;
    }
}
