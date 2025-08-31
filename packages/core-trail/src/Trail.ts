import type { UserDocument } from '@appvantageasia/core-users';
import { ObjectId } from 'mongodb';
import getCollections, { type TrailDocument } from './getCollections.js';

class Trail {
    private document: TrailDocument;

    constructor() {
        this.document = {
            _id: new ObjectId(),
            date: new Date(),
            level: 'info',
            author: { origin: 'anonymous' },
            specs: {},
        };
    }

    public setDate(date: Date) {
        this.document.date = date;

        return this;
    }

    public now() {
        return this.setDate(new Date());
    }

    public setLevel(level: 'error' | 'warning' | 'info') {
        this.document.level = level;

        return this;
    }

    public error() {
        return this.setLevel('error');
    }

    public warn() {
        return this.setLevel('warning');
    }

    public info() {
        return this.setLevel('info');
    }

    public setAuthor(author: object) {
        this.document.author = author;

        return this;
    }

    public anonymous() {
        return this.setAuthor({ origin: 'anonymous' });
    }

    public system() {
        return this.setAuthor({ origin: 'system' });
    }

    public user(user: UserDocument) {
        return this.setAuthor({ origin: 'user', userId: user._id, email: user.email });
    }

    public setSpec(specName: string, value: any) {
        this.document.specs[specName] = value;

        return this;
    }

    public eventType(type: string) {
        return this.setSpec('eventType', type);
    }

    public async save() {
        const { trails } = await getCollections();

        return trails.insertOne(this.document);
    }
}

export default Trail;
