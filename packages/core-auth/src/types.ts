import type { CredentialDeviceType, AuthenticatorTransportFuture } from '@simplewebauthn/types';
import type { ObjectId } from 'mongodb';

export interface SSOBaseConfig {
    enforced: boolean;
}

export interface MSALConfig extends SSOBaseConfig {
    clientId: string;
    clientSecret: string;
    authority: string;
}

export interface OIDCConfig extends SSOBaseConfig {
    endpoint: string;
    clientId: string;
    clientSecret: string;
    allowUnsecure?: boolean;
}

export interface PassKeyAuthenticator {
    // SQL: Encode to base64url then store as `TEXT`. Index this column
    credentialID: string;
    // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
    credentialPublicKey: Uint8Array;
    // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
    counter: number;
    // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
    // Ex: 'singleDevice' | 'multiDevice'
    credentialDeviceType: CredentialDeviceType;
    // SQL: `BOOL` or whatever similar type is supported
    credentialBackedUp: boolean;
    // SQL: `VARCHAR(255)` and store string array as a CSV string
    // Ex: ['usb' | 'ble' | 'nfc' | 'internal']
    transports?: AuthenticatorTransportFuture[];
}

export interface PassKeyAuthProfileDocument {
    _id: ObjectId;
    _type: 'passkey';
    authenticator: PassKeyAuthenticator;
    createdAt: Date;
    lastUsedAt: Date | null;
}

export interface MSALAuthProfileDocument {
    _id: ObjectId;
    _type: 'msal';
    lastUsedAt: Date | null;
}

export interface OIDCAuthProfileDocument {
    _id: ObjectId;
    _type: 'oidc';
    lastUsedAt: Date | null;
}

export interface OTPAuthProfileDocument {
    _id: ObjectId;
    _type: 'otp';
    secret: string;
    date: Date;
}

export interface LocalAuthProfileDocument {
    _id: ObjectId;
    _type: 'local';
    password: string;
    passwordChangedAt: Date;
    previousPasswords: { password: string }[];
    lastUsedAt: Date | null;
}

export type AuthProfileDocument =
    | LocalAuthProfileDocument
    | MSALAuthProfileDocument
    | PassKeyAuthProfileDocument
    | OTPAuthProfileDocument
    | OIDCAuthProfileDocument;
