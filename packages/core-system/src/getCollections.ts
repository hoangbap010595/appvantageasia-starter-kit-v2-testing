import { getDatabaseClient } from '@appvantageasia/core-database';
import type { Collection, ObjectId } from 'mongodb';

export interface SystemConfigDocument<Value extends object = any> {
    _id: ObjectId;
    key: string;
    value: Value;
}

export interface Collections {
    configs: Collection<SystemConfigDocument>;
}

const getCollections = async (): Promise<Collections> => {
    const { db } = await getDatabaseClient();

    return {
        configs: db.collection<SystemConfigDocument>('system_configs'),
    };
};

export default getCollections;
