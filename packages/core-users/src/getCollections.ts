import { type AuthProfileDocument } from '@appvantageasia/core-auth';
import { getDatabaseClient } from '@appvantageasia/core-database';
import type { Collection, ObjectId } from 'mongodb';

export interface UserDocument {
    _id: ObjectId;
    email: string;
    name: string;
    isSuperAdmin: boolean;
    authProfiles: AuthProfileDocument[];
    _caslType: 'User';
}

export interface UserSession {
    _id: ObjectId;
    userId: ObjectId;
    expiresAt: Date;
    lastActivityAt: Date;
    revoked: boolean;
    userAgent?: string;
    ip?: string | null;
}

export interface Collections {
    users: Collection<UserDocument>;
    sessions: Collection<UserSession>;
}

const getCollections = async (): Promise<Collections> => {
    const { db } = await getDatabaseClient();

    return {
        users: db.collection<UserDocument>('user_identities'),
        sessions: db.collection<UserSession>('user_sessions'),
    };
};

export default getCollections;
