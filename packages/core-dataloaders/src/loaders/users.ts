import { type UserDocument, getCollections } from '@appvantageasia/core-users';
import type DataLoader from 'dataloader';
import type { ObjectId } from 'mongodb';
import { buildOneToOneLoader } from '../helper.js';

export interface UserLoaders {
    userById: DataLoader<ObjectId, UserDocument>;
}

const createUserLoaders = (): UserLoaders => {
    const userById = buildOneToOneLoader<UserDocument>(keys =>
        getCollections().then(({ users }) => users.find({ _id: { $in: keys } }).toArray())
    );

    return { userById };
};

export default createUserLoaders;
