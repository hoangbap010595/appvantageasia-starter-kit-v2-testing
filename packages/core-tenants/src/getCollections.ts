import { getDatabaseClient } from '@appvantageasia/core-database';
import type { Collection, ObjectId } from 'mongodb';

export interface TenantMembership {
    userId: ObjectId;
    role: TenantMembershipRole;
}

export interface TenantDocument {
    _id: ObjectId;
    name: string;
    slug: string;
    users: TenantMembership[];
    _caslType: 'Tenant';
}

export enum TenantMembershipRole {
    Admin = 'admin',
    User = 'user',
}

export interface Collections {
    tenants: Collection<TenantDocument>;
}

const getCollections = async (): Promise<Collections> => {
    const { db } = await getDatabaseClient();

    return {
        tenants: db.collection<TenantDocument>('tenants_instances'),
    };
};

export default getCollections;
