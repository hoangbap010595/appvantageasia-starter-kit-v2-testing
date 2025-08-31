import { OTPAuthentication } from '@appvantageasia/core-auth';
import type { Collection } from 'mongodb';
import getCollections, { type UserDocument } from '../getCollections.js';

export class UserOTPAuthentication extends OTPAuthentication<UserDocument> {
    async getUserCollection(): Promise<Collection<UserDocument>> {
        const { users } = await getCollections();

        return users;
    }

    getUserEmail(user: UserDocument): string {
        return user.email;
    }
}

const otpAuthentication = new UserOTPAuthentication();

export default otpAuthentication;
