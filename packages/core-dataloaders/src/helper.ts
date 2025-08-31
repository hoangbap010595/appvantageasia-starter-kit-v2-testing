import DataLoader from 'dataloader';
import groupBy from 'lodash/fp/groupBy.js';
import keyBy from 'lodash/fp/keyBy.js';
import type { ObjectId } from 'mongodb';

export type GetItems<TDocument> = (keys: ObjectId[]) => Promise<TDocument[]>;

const getDocumentId = <TDocument extends { _id: ObjectId }>(document: TDocument) => document._id.toHexString();

export const buildOneToOneLoader = <TDocument extends { _id: ObjectId }>(
    getItems: GetItems<TDocument>,
    getKey: (document: TDocument) => string = getDocumentId
): DataLoader<ObjectId, TDocument> =>
    new DataLoader<ObjectId, TDocument>(async keys => {
        const documents = await getItems([...keys]);
        const mappedDocuments = keyBy(getKey, documents);

        return keys.map(key => mappedDocuments[key.toHexString()] || null);
    });

export const ensureManyFromLoaders = <Item>(results: (Item | Error)[]): Item[] => {
    const error = results.find(item => item instanceof Error);

    if (error) {
        throw error;
    }

    return results as Item[];
};

export const buildOneToManyLoader = <TDocument extends { _id: ObjectId }>(
    getItems: GetItems<TDocument>,
    getKey: (document: TDocument) => string = getDocumentId
): DataLoader<ObjectId, TDocument[]> =>
    new DataLoader<ObjectId, TDocument[]>(async keys => {
        const documents = await getItems([...keys]);
        const mappedDocuments = groupBy(getKey, documents);

        return keys.map(key => mappedDocuments[key.toHexString()] || []);
    });
