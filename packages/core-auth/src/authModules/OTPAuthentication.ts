import { getRedisInstance } from '@appvantageasia/core-redis';
import type { Collection, Filter, UpdateFilter } from 'mongodb';
import { ObjectId } from 'mongodb';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import type { OTPAuthProfileDocument, AuthProfileDocument } from '../types.js';

const isOtpProfile = (profile: AuthProfileDocument): profile is OTPAuthProfileDocument => profile._type === 'otp';

const getOptSecretCacheKey = (userId: ObjectId) => `otpSecret:${userId}`;

interface BaseUser {
    _id: ObjectId;
    authProfiles: AuthProfileDocument[];
}

abstract class OTPAuthentication<User extends BaseUser> {
    abstract getUserCollection(): Promise<Collection<User>>;

    abstract getUserEmail(user: User): string;

    getProfile(user: User) {
        return user.authProfiles.find(isOtpProfile) || null;
    }

    async generateAuthenticatorQrCode(user: User): Promise<string> {
        const secret = authenticator.generateSecret();
        const otpAuth = authenticator.keyuri(this.getUserEmail(user), 'Apv Starter Kit', secret);

        const cacheKey = getOptSecretCacheKey(user._id);
        const redis = await getRedisInstance();
        await redis.set(cacheKey, secret, 'EX', 10 * 60);

        return new Promise((resolve, reject) => {
            qrcode.toDataURL(otpAuth, (error, imageUrl) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(imageUrl);
                }
            });
        });
    }

    async validateAuthenticator(
        user: User,
        token: string
    ): Promise<'token-expired' | { secret: string; verified: boolean }> {
        const cacheKey = getOptSecretCacheKey(user._id);
        const redis = await getRedisInstance();
        const secret = await redis.get(cacheKey);

        if (!secret) {
            return 'token-expired';
        }

        return {
            secret,
            verified: authenticator.verify({ token, secret }),
        };
    }

    async validateOtp(user: User, token: string): Promise<boolean> {
        const profile = this.getProfile(user);

        if (!profile) {
            throw new Error('User does not have a otp profile for authentication');
        }

        return authenticator.verify({ token, secret: profile.secret });
    }

    async enableAuthenticator(user: User, secret: string): Promise<User> {
        const profile = this.getProfile(user);

        if (profile) {
            throw new Error('User already have a otp profile');
        }

        const users = await this.getUserCollection();

        const newProfile: OTPAuthProfileDocument = {
            _id: new ObjectId(),
            _type: 'otp',
            secret,
            date: new Date(),
        };

        const filter: Filter<BaseUser> = { _id: user._id };
        const update: UpdateFilter<BaseUser> = { $push: { authProfiles: newProfile } };

        const updatedUser = await users.findOneAndUpdate(filter as Filter<User>, update as UpdateFilter<User>, {
            returnDocument: 'after',
        });

        return updatedUser! as User;
    }

    async disableAuthenticator(user: User): Promise<User> {
        const profile = this.getProfile(user);

        if (!profile) {
            // there is no profile to disable
            return user;
        }

        const users = await this.getUserCollection();

        const filter: Filter<BaseUser> = { _id: user._id };
        const update: UpdateFilter<BaseUser> = { $pull: { authProfiles: { _id: profile._id } } };

        const updatedUser = await users.findOneAndUpdate(filter as Filter<User>, update as UpdateFilter<User>, {
            returnDocument: 'after',
        });

        return updatedUser! as User;
    }

    isRequireOtp(user: User): boolean {
        return !!this.getProfile(user);
    }
}

export default OTPAuthentication;
