import { regexp } from '@appvantageasia/core-node-utils';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import type { Collection, Filter, UpdateFilter } from 'mongodb';
import { ObjectId } from 'mongodb';
import * as config from '../config.js';
import type { LocalAuthProfileDocument, AuthProfileDocument } from '../types.js';
import type OTPAuthentication from './OTPAuthentication.js';

const { genSalt, hash, compare } = bcrypt;

const isAuthLocalProfile = (profile: AuthProfileDocument): profile is LocalAuthProfileDocument =>
    profile._type === 'local';

interface BaseUser {
    _id: ObjectId;
    authProfiles: AuthProfileDocument[];
}

abstract class LocalAuthentication<User extends BaseUser> {
    abstract getUserCollection(): Promise<Collection<User>>;

    getProfile(user: User) {
        return user.authProfiles.find(isAuthLocalProfile) || null;
    }

    private otpAuthentication: OTPAuthentication<User>;

    constructor(otpAuthentication: OTPAuthentication<User>) {
        this.otpAuthentication = otpAuthentication;
    }

    async comparePassword(user: User, password: string): Promise<boolean> {
        const profile = this.getProfile(user);

        if (!profile) {
            return false;
        }

        return compare(password, profile.password);
    }

    async checkNewPasswordValidity(
        password: string,
        user?: User,
        byPassMissingProfile = false
    ): Promise<'reused-previous-password' | 'minimum-length' | 'weak-password' | true> {
        if (password.length < config.localMinimumLength) {
            return 'minimum-length';
        }

        if (!regexp.password.test(password)) {
            return 'weak-password';
        }

        if (user) {
            const profile = this.getProfile(user);

            if (!profile) {
                if (byPassMissingProfile) {
                    return true;
                }

                throw new Error('User does not have a local profile for authentication');
            }

            // check the password is not re-use
            const comparisons = await Promise.all(
                [...profile.previousPasswords, { password: profile.password }].map(entry =>
                    compare(password, entry.password)
                )
            );

            if (comparisons.find(Boolean)) {
                return 'reused-previous-password';
            }
        }

        return true;
    }

    async changePassword(user: User, password: string): Promise<User> {
        const profile = this.getProfile(user);

        if (!profile) {
            // we will need to create a profile instead
            return this.createProfile(user, password);
        }

        const salt = await genSalt(config.localSalt);
        const passwordHash = await hash(password, salt);

        const users = await this.getUserCollection();

        const filter: Filter<BaseUser> = { _id: user._id, 'authProfiles._id': profile._id };
        const update: UpdateFilter<BaseUser> = {
            $set: {
                'authProfiles.$.password': passwordHash,
                'authProfiles.$.passwordChangedAt': new Date(),
                'authProfiles.$.previousPasswords': [
                    { password: profile.password },
                    ...profile.previousPasswords,
                ].slice(0, config.localPreviousPasswords),
            },
        };

        const updatedUser = await users.findOneAndUpdate(filter as Filter<User>, update as UpdateFilter<User>, {
            returnDocument: 'after',
        });

        return updatedUser! as User;
    }

    async updateLastUsedAt(user: User): Promise<User> {
        const profile = this.getProfile(user);

        if (!profile) {
            throw new Error('User does not have a local profile for authentication');
        }

        const users = await this.getUserCollection();

        const filter: Filter<BaseUser> = { _id: user._id, 'authProfiles._id': profile._id };
        const update: UpdateFilter<BaseUser> = { $set: { 'authProfiles.$.lastUsedAt': new Date() } };

        const updatedUser = await users.findOneAndUpdate(filter as Filter<User>, update as UpdateFilter<User>, {
            returnDocument: 'after',
        });

        return updatedUser! as User;
    }

    checkIsPasswordExpired(user: User) {
        const profile = this.getProfile(user);

        if (!profile) {
            throw new Error('User does not have a local profile for authentication');
        }

        if (dayjs(profile.passwordChangedAt).add(config.localPasswordDuration, 'd').isBefore(new Date())) {
            return true;
        }

        return false;
    }

    async authenticate(user: User, password: string): Promise<false | 'reset-password' | 'require-otp' | true> {
        const passwordMatch = await this.comparePassword(user, password);

        if (!passwordMatch) {
            return false;
        }

        if (this.otpAuthentication.isRequireOtp(user)) {
            return 'require-otp';
        }

        if (this.checkIsPasswordExpired(user)) {
            return 'reset-password';
        }

        // we can update the date at which this profile was used
        return true;
    }

    async createProfile(user: User, password: string): Promise<User> {
        if (this.getProfile(user)) {
            throw new Error('User already has a local profile');
        }

        const salt = await genSalt(config.localSalt);
        const passwordHash = await hash(password, salt);

        const profile: LocalAuthProfileDocument = {
            _id: new ObjectId(),
            _type: 'local',
            password: passwordHash,
            passwordChangedAt: new Date(),
            previousPasswords: [],
            lastUsedAt: null,
        };

        const users = await this.getUserCollection();

        const filter: Filter<BaseUser> = { _id: user._id };
        const update: UpdateFilter<BaseUser> = { $push: { authProfiles: profile } };

        const updatedUser = await users.findOneAndUpdate(filter as Filter<User>, update as UpdateFilter<User>, {
            returnDocument: 'after',
        });

        return updatedUser! as User;
    }
}

export default LocalAuthentication;
