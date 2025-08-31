import type { OIDCConfig } from '@appvantageasia/core-auth';
import { OIDCAuthentication } from '@appvantageasia/core-auth';
import { getSystemConfig, upsetSystemConfig } from '@appvantageasia/core-system';
import type { Collection } from 'mongodb';
import getCollections, { type UserDocument } from '../getCollections.js';

const systemKey = 'OIDC';

export class UserOIDCAuthentication extends OIDCAuthentication<UserDocument> {
    async getUserCollection(): Promise<Collection<UserDocument>> {
        const { users } = await getCollections();

        return users;
    }

    getConfig(): Promise<OIDCConfig | null> {
        return getSystemConfig<OIDCConfig>(systemKey);
    }

    updateConfig(config: OIDCConfig | null) {
        return upsetSystemConfig(systemKey, config);
    }
}

const oidcAuthentication = new UserOIDCAuthentication();

export default oidcAuthentication;
