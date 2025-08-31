import type { MSALConfig } from '@appvantageasia/core-auth';
import { MSALAuthentication } from '@appvantageasia/core-auth';
import { getSystemConfig, upsetSystemConfig } from '@appvantageasia/core-system';
import type { Collection } from 'mongodb';
import getCollections, { type UserDocument } from '../getCollections.js';

const systemKey = 'MSAL';

export class UserMSALAuthentication extends MSALAuthentication<UserDocument> {
    async getUserCollection(): Promise<Collection<UserDocument>> {
        const { users } = await getCollections();

        return users;
    }

    getConfig(): Promise<MSALConfig | null> {
        return getSystemConfig<MSALConfig>(systemKey);
    }

    updateConfig(config: MSALConfig | null) {
        return upsetSystemConfig(systemKey, config);
    }
}

const msalAuthentication = new UserMSALAuthentication();

export default msalAuthentication;
