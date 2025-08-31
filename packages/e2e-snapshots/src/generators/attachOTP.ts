import type { OTPAuthProfileDocument } from '@appvantageasia/core-auth';
import { ObjectId } from 'mongodb';
import { authenticator } from 'otplib';
import type { E2EUserDocument } from './createUser.js';

const attachOTP = async (document: E2EUserDocument): Promise<E2EUserDocument> => {
    // otp document
    const secret = authenticator.generateSecret();
    const newProfile: OTPAuthProfileDocument = {
        _id: new ObjectId(),
        _type: 'otp',
        secret,
        date: new Date(),
    };

    const { authProfiles } = document;
    authProfiles.push(newProfile);

    return {
        ...document,
        authProfiles,
    };
};

export default attachOTP;
