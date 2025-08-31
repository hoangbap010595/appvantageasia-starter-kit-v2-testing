import { getCurrentSnapshots } from './loadSnapshots.js';

const getAuthCredentials = async ({
    e2eId,
    resetPasswordValidity = true,
    outdated,
}: {
    e2eId: string;
    resetPasswordValidity?: boolean;
    outdated?: boolean;
}) => {
    if (resetPasswordValidity) {
        await getCurrentSnapshots().users.resetLocalPasswordValidity(e2eId, outdated);
    }

    return getCurrentSnapshots().users.getLocalCredentials(e2eId);
};

export default getAuthCredentials;
