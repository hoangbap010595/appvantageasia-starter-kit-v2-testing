import type { UserSessionBroadcastSpecsFragment } from '../BroadcastSpecs.api';

const handler = (payload: UserSessionBroadcastSpecsFragment) => {
    console.info(payload.revokeSession);
};

export default handler;
