import createSender from './createSender.js';
import Otp from './templates/Otp.jsx';
import PasswordUpdate from './templates/PasswordUpdate.jsx';
import ResetPassword from './templates/ResetPassword.jsx';
import TwoFactorUpdate from './templates/TwoFactorUpdate.jsx';

export const renderPasswordUpdate = createSender(PasswordUpdate);
export const renderTwoFactorUpdate = createSender(TwoFactorUpdate);
export const renderOtp = createSender(Otp);
export const renderResetPassword = createSender(ResetPassword);
