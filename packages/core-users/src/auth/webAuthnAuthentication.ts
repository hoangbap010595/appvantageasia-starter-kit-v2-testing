import { WebAuthnAuthentication } from '@appvantageasia/core-auth';
import type { Collection } from 'mongodb';
import getCollections, { type UserDocument } from '../getCollections.js';

export class UserWebAuthnAuthentication extends WebAuthnAuthentication<UserDocument> {
    async getUserCollection(): Promise<Collection<UserDocument>> {
        const { users } = await getCollections();

        return users;
    }

    getUserEmail(user: UserDocument): string {
        return user.email;
    }
}

const webAuthnAuthentication = new UserWebAuthnAuthentication();

export default webAuthnAuthentication;
