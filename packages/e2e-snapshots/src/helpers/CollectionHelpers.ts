import { getDatabaseClient } from '@appvantageasia/core-database';
import type { Filter, Document } from 'mongodb';

class CollectionHelpers<DocumentType extends Document> {
    public readonly collectionName: string;

    public readonly db?: string;

    constructor(collectionName: string, db?: string) {
        this.collectionName = collectionName;
        this.db = db;
    }

    public async getDb() {
        const { db, client } = await getDatabaseClient();

        if (this.db) {
            return client.db(this.db);
        }

        return db;
    }

    public async find(filter: Filter<DocumentType>) {
        const db = await this.getDb();

        return db.collection<DocumentType>(this.collectionName).find(filter).toArray();
    }

    public async findOne(filter: Filter<DocumentType>) {
        const db = await this.getDb();

        return db.collection<DocumentType>(this.collectionName).findOne(filter);
    }
}

export default CollectionHelpers;
