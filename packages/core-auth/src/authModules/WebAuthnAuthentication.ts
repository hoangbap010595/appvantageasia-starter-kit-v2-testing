import { randomUUID } from 'node:crypto';
import { getRedisInstance } from '@appvantageasia/core-redis';
import type { VerifiedRegistrationResponse, VerifiedAuthenticationResponse } from '@simplewebauthn/server';
import type { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/types';
import type { Collection, Filter, UpdateFilter } from 'mongodb';
import { ObjectId } from 'mongodb';
import * as config from '../config.js';
import type { AuthProfileDocument, PassKeyAuthProfileDocument } from '../types.js';

const isPassKeyAuthProfile = (profile: AuthProfileDocument): profile is PassKeyAuthProfileDocument =>
    profile._type === 'passkey';

interface BaseUser {
    _id: ObjectId;
    authProfiles: AuthProfileDocument[];
}

abstract class WebAuthnAuthentication<User extends BaseUser> {
    abstract getUserCollection(): Promise<Collection<User>>;
    abstract getUserEmail(user: User): string;

    getProfiles(user: User) {
        return user.authProfiles.filter(isPassKeyAuthProfile);
    }

    async startRegistration(user: User) {
        // get en encoder instance to transform our user ID into an UInt8Array
        const encoder = new TextEncoder();

        const { generateRegistrationOptions } = await import('@simplewebauthn/server');

        // generate options for the registration
        const options = await generateRegistrationOptions({
            rpName: config.passKeyRpName,
            rpID: config.passKeyRpId,
            userID: encoder.encode(user._id.toString()),
            userName: this.getUserEmail(user),
            // Don't prompt users for additional information about the authenticator
            // (Recommended for smoother UX)
            attestationType: 'none',
            // Prevent users from re-registering existing authenticators
            excludeCredentials: this.getProfiles(user).map(item => ({
                id: item.authenticator.credentialID,
                transports: item.authenticator.transports,
            })),
            // See "Guiding use of authenticators via authenticatorSelection" below
            authenticatorSelection: {
                // Defaults
                residentKey: 'preferred',
                userVerification: 'preferred',
                // Optional
                authenticatorAttachment: 'platform',
            },
        });

        // persist the challenge for the user
        const redis = await getRedisInstance();
        await redis.setex(`passkey:registration:${user._id.toHexString()}`, 60 * 10, options.challenge);

        return options;
    }

    async finalizeRegistration(
        user: User,
        response: RegistrationResponseJSON
    ): Promise<{ error: string; user: null } | { error: null; user: User }> {
        const users = await this.getUserCollection();
        let verification: VerifiedRegistrationResponse;

        // get the challenge
        const redis = await getRedisInstance();
        const challenge = await redis.get(`passkey:registration:${user._id.toHexString()}`);

        const { verifyRegistrationResponse } = await import('@simplewebauthn/server');

        try {
            verification = await verifyRegistrationResponse({
                response,
                // if the challenge does not exist provide a random string as challenge
                // this will fail the verification
                expectedChallenge: challenge || randomUUID(),
                expectedOrigin: config.passKeyOrigin,
                expectedRPID: config.passKeyRpId,
            });

            if (!verification.verified) {
                return { error: 'Invalid verification', user: null };
            }
        } catch (error) {
            return { error: (error as Error).message, user: null };
        }

        // since we passed the registration we can see registrationInfo as non-null
        const { registrationInfo } = verification;
        const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo!;
        const profile: PassKeyAuthProfileDocument = {
            _id: new ObjectId(),
            _type: 'passkey',
            authenticator: {
                credentialID: credential.id,
                credentialPublicKey: credential.publicKey,
                counter: credential.counter,
                credentialDeviceType,
                credentialBackedUp,
                transports: credential.transports,
            },
            createdAt: new Date(),
            lastUsedAt: null,
        };

        const filter: Filter<BaseUser> = { _id: user._id };
        const update: UpdateFilter<BaseUser> = { $push: { authProfiles: profile } };

        // add the auth profile on the user document
        const updatedUser = await users.findOneAndUpdate(filter as Filter<User>, update as UpdateFilter<User>, {
            returnDocument: 'after',
        });

        return { error: null, user: updatedUser! as User };
    }

    async startAuthentication(user: User) {
        const { generateAuthenticationOptions } = await import('@simplewebauthn/server');

        const options = await generateAuthenticationOptions({
            rpID: config.passKeyRpId,
            allowCredentials: this.getProfiles(user).map(item => ({
                id: item.authenticator.credentialID,
                transports: item.authenticator.transports,
            })),
            userVerification: 'preferred',
        });

        // persist the challenge for the user
        const redis = await getRedisInstance();
        await redis.setex(`passkey:authentication:${user._id.toHexString()}`, 60 * 10, options.challenge);

        return options;
    }

    async finalizeAuthentication(
        user: User,
        response: AuthenticationResponseJSON
    ): Promise<{ error: string; user: null } | { error: null; user: User }> {
        const users = await this.getUserCollection();
        let verification: VerifiedAuthenticationResponse;

        // get the challenge for the user
        const redis = await getRedisInstance();
        const challenge = await redis.get(`passkey:authentication:${user._id.toHexString()}`);

        const profile = this.getProfiles(user).find(item => item.authenticator.credentialID === response.id)!;
        const { authenticator } = profile;

        try {
            const { verifyAuthenticationResponse } = await import('@simplewebauthn/server');
            verification = await verifyAuthenticationResponse({
                response,
                expectedChallenge: challenge || randomUUID(),
                expectedOrigin: config.passKeyOrigin,
                expectedRPID: config.passKeyRpId,
                credential: {
                    id: authenticator.credentialID,
                    publicKey: authenticator.credentialPublicKey,
                    counter: authenticator.counter,
                    transports: authenticator.transports,
                },
            });

            if (!verification.verified) {
                return { error: 'Invalid verification', user: null };
            }
        } catch (error) {
            return { error: (error as Error).message, user: null };
        }

        const filter: Filter<BaseUser> = { _id: user._id, 'authProfiles._id': profile._id };
        const update: UpdateFilter<BaseUser> = {
            $set: {
                counter: verification.authenticationInfo.newCounter,
                'authProfiles.$.lastUsedAt': new Date(),
            },
        };

        const updatedUser = await users.findOneAndUpdate(filter as Filter<User>, update as UpdateFilter<User>, {
            returnDocument: 'after',
        });

        return { error: null, user: updatedUser! as User };
    }
}

export default WebAuthnAuthentication;
