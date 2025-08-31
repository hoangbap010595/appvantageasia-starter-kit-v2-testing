import { getDatabaseClient } from '@appvantageasia/core-database';
import type { Collection, ObjectId } from 'mongodb';

export interface TrailDocument {
    _id: ObjectId;
    date: Date;
    level: 'error' | 'warning' | 'info';
    author: object;
    specs: Record<string, any>;
}

export interface Collections {
    trails: Collection<TrailDocument>;
}

const getCollections = async (): Promise<Collections> => {
    const { db } = await getDatabaseClient();

    return {
        trails: db.collection<TrailDocument>('trails_entries'),
    };
};

export default getCollections;
