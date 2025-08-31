import * as msal from '@azure/msal-node';
import type { Collection, Filter, UpdateFilter } from 'mongodb';
import { ObjectId } from 'mongodb';
import type { MSALAuthProfileDocument, AuthProfileDocument, MSALConfig } from '../types.js';

const isMsalAuthProfile = (profile: AuthProfileDocument): profile is MSALAuthProfileDocument =>
    profile._type === 'msal';

interface BaseUser {
    _id: ObjectId;
    authProfiles: AuthProfileDocument[];
}

abstract class MSALAuthentication<User extends BaseUser> {
    abstract getUserCollection(): Promise<Collection<User>>;
    abstract getConfig(): Promise<MSALConfig | null>;

    getProfile(user: User) {
        return user.authProfiles.find(isMsalAuthProfile) || null;
    }

    private async getPCA() {
        const config = await this.getConfig();

        if (!config) {
            throw new Error('MSAL configuration is not available');
        }

        return new msal.ConfidentialClientApplication({ auth: config });
    }

    async upsertProfile(user: User): Promise<User> {
        const users = await this.getUserCollection();

        let profile = this.getProfile(user);

        if (!profile) {
            profile = {
                _id: new ObjectId(),
                _type: 'msal',
                lastUsedAt: null,
            };

            const filter: Filter<BaseUser> = { _id: user._id };
            const update: UpdateFilter<BaseUser> = { $push: { authProfiles: profile } };

            const updatedUser = await users.findOneAndUpdate(filter as Filter<User>, update as UpdateFilter<User>, {
                returnDocument: 'after',
            });

            return updatedUser! as User;
        }

        const filter: Filter<BaseUser> = { _id: user._id, 'authProfiles._id': profile._id };
        const update: UpdateFilter<BaseUser> = { $set: { 'authProfiles.$.lastUsedAt': new Date() } };

        const updatedUser = await users.findOneAndUpdate(filter as Filter<User>, update as UpdateFilter<User>, {
            returnDocument: 'after',
        });

        return updatedUser! as User;
    }

    async getLoginUrl(callbackUrl: string) {
        const pca = await this.getPCA();

        return pca.getAuthCodeUrl({
            scopes: ['user.read'],
            redirectUri: callbackUrl,
        });
    }

    async verifyCredentials(code: string, callbackUrl: string) {
        try {
            const pca = await this.getPCA();
            const response = await pca.acquireTokenByCode({
                code,
                scopes: ['user.read'],
                redirectUri: callbackUrl,
            });

            return response.account;
        } catch (error) {
            console.info(error);

            return null;
        }
    }
}

export default MSALAuthentication;
