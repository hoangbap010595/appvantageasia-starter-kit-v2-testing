import { getCurrentSnapshots } from './loadSnapshots.js';

const getUser = async (e2eId: string) => getCurrentSnapshots().users.findByE2eId(e2eId);

export default getUser;
