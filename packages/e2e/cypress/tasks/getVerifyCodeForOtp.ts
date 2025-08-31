import { getCurrentSnapshots } from './loadSnapshots.js';

const getVerifyCodeForOtp = async (e2eId: string) => getCurrentSnapshots().users.getVerifyCodeForOtp(e2eId);

export default getVerifyCodeForOtp;
