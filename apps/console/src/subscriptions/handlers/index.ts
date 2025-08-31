import type { BroadcastSpecsFragment } from '../BroadcastSpecs.api';

const handler = async (payload: BroadcastSpecsFragment) => {
    switch (payload.__typename) {
        case 'UserSessionBroadcast':
            return import('./handleUserSessionBroadcast').then(handler => handler.default(payload));

        default:
            return undefined;
    }
};

export default handler;
