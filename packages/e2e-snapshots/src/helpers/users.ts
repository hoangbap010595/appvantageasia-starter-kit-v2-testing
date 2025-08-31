import type { OTPAuthProfileDocument } from '@appvantageasia/core-auth';
import { getDatabaseClient } from '@appvantageasia/core-database';
import { getRedisInstance } from '@appvantageasia/core-redis';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { authenticator } from 'otplib';
import type { E2EUserDocument } from '../generators/createUser.js';
import CollectionHelpers from './CollectionHelpers.js';

class Users extends CollectionHelpers<E2EUserDocument> {
    constructor() {
        super('user_identities');
    }

    public async findByE2eId(e2eId: string) {
        const user = await this.findOne({ '__e2e__.id': e2eId });

        if (!user) {
            throw new Error(`User with e2eId ${e2eId} not found`);
        }

        return user;
    }

    public async getLocalCredentials(e2eId: string) {
        const user = await this.findByE2eId(e2eId);

        return {
            email: user.email,
            password: user.__e2e__.password,
        };
    }

    public async getOtpCredentials(e2eId: string) {
        const user = await this.findByE2eId(e2eId);

        const profile = user.authProfiles.find((item: any) => item._type === 'otp');

        if (!profile) {
            throw new Error(`User with e2eId ${e2eId} does not have a otp profile`);
        }

        return authenticator.generate((profile as OTPAuthProfileDocument).secret);
    }

    public async getVerifyCodeForOtp(e2eId: string) {
        const user = await this.findByE2eId(e2eId);

        const redis = await getRedisInstance();
        const secret = await redis.get(`otpSecret:${user._id}`);

        if (!secret) {
            throw new Error('QR code is expired');
        }

        return authenticator.generate(secret);
    }

    public async resetLocalPasswordValidity(e2eId: string, outdated?: boolean) {
        const user = await this.findByE2eId(e2eId);
        const profile = user.authProfiles.find((item: any) => item._type === 'local');

        if (!profile) {
            throw new Error(`User with e2eId ${e2eId} does not have a local profile`);
        }

        const passwordChangedAt = faker.date.between({
            from: dayjs()
                .add(outdated ? -120 : -89, 'days')
                .toDate(),
            to: outdated ? dayjs().add(-90, 'days').toDate() : new Date(),
        });

        const lastUsedAt = faker.date.between({ from: passwordChangedAt, to: new Date() });

        const { db } = await getDatabaseClient();

        return db.collection<E2EUserDocument>(this.collectionName).updateOne(
            {
                _id: user._id,
                'authProfiles._id': profile._id,
            },
            {
                $set: {
                    'authProfiles.$.passwordChangedAt': passwordChangedAt,
                    'authProfiles.$.lastUsedAt': lastUsedAt,
                },
            }
        );
    }
}

export default new Users();
