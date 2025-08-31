import { URL } from 'node:url';
import type { Collection, Filter, UpdateFilter } from 'mongodb';
import { ObjectId } from 'mongodb';
import * as client from 'openid-client';
import type { OIDCAuthProfileDocument, AuthProfileDocument, OIDCConfig } from '../types.js';

const isOIDCAuthProfile = (profile: AuthProfileDocument): profile is OIDCAuthProfileDocument =>
    profile._type === 'oidc';

interface BaseUser {
    _id: ObjectId;
    authProfiles: AuthProfileDocument[];
}

export interface OIDCState {
    codeVerifier: string;
    nonce?: string;
}

abstract class OIDCAuthentication<User extends BaseUser> {
    abstract getUserCollection(): Promise<Collection<User>>;
    abstract getConfig(): Promise<OIDCConfig | null>;

    getProfile(user: User) {
        return user.authProfiles.find(isOIDCAuthProfile) || null;
    }

    async upsertProfile(user: User): Promise<User> {
        const users = await this.getUserCollection();
        let profile = this.getProfile(user);

        if (!profile) {
            profile = {
                _id: new ObjectId(),
                _type: 'oidc',
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

    async getOIDC() {
        const config = await this.getConfig();

        if (!config) {
            throw new Error('OIDC configuration is not available');
        }

        return client.discovery(new URL(config.endpoint), config.clientId, config.clientSecret, undefined, {
            execute: config.allowUnsecure ? [client.allowInsecureRequests] : [],
        });
    }

    async getLoginUrl(callbackUrl: string): Promise<{ url: string; state: OIDCState }> {
        const config = await this.getOIDC();
        const codeVerifier = client.randomPKCECodeVerifier();
        const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

        const parameters: Record<string, string> = {
            redirect_uri: callbackUrl,
            scope: 'openid email',
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
        };

        let nonce;

        if (!config.serverMetadata().supportsPKCE()) {
            /**
             * We cannot be sure the AS supports PKCE so we're going to use nonce too. Use
             * of PKCE is backwards compatible even if the AS doesn't support it which is
             * why we're using it regardless.
             */
            nonce = client.randomNonce();
            parameters.nonce = nonce;
        }

        const url = client.buildAuthorizationUrl(config, parameters);

        return {
            url: url.toString(),
            state: { nonce, codeVerifier },
        };
    }

    async verifyCredentials(originalUrl: string, state: OIDCState) {
        try {
            const config = await this.getOIDC();

            const tokens = await client.authorizationCodeGrant(config, new URL(originalUrl), {
                pkceCodeVerifier: state.codeVerifier,
                expectedNonce: state.nonce,
                idTokenExpected: true,
            });

            const claims = tokens.claims();

            return await client.fetchUserInfo(config, tokens.access_token, claims!.sub);
        } catch (error) {
            console.info(error);

            return null;
        }
    }
}

export default OIDCAuthentication;
