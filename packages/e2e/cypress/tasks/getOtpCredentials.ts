import { getCurrentSnapshots } from './loadSnapshots.js';

const getOtpCredentials = async (e2eId: string) => getCurrentSnapshots().users.getOtpCredentials(e2eId);

export default getOtpCredentials;
