import { setupProcess as sendOTP } from './sendOTP/index.js';
import { setupProcess as sendPasswordUpdate } from './sendPasswordUpdate/index.js';
import { setupProcess as sendResetPassword } from './sendResetPassword/index.js';
import { setupProcess as sendTwoFactorUpdate } from './sendTwoFactorUpdate/index.js';

const setupProcess = async () => {
    // we do not need to await for these processes
    sendPasswordUpdate();
    sendTwoFactorUpdate();
    sendOTP();
    sendResetPassword();
};

export default setupProcess;
