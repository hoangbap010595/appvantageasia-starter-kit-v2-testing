import { LocalAuthentication } from '@appvantageasia/core-auth';
import type { Collection } from 'mongodb';
import getCollections, { type UserDocument } from '../getCollections.js';
import otpAuthentication from './otpAuthentication.js';

export class UserLocalAuthentication extends LocalAuthentication<UserDocument> {
    async getUserCollection(): Promise<Collection<UserDocument>> {
        const { users } = await getCollections();

        return users;
    }
}

const localAuthentication = new UserLocalAuthentication(otpAuthentication);

export default localAuthentication;
