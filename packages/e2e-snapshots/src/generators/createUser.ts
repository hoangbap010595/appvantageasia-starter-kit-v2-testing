import { type UserDocument } from '@appvantageasia/core-users';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

const { genSalt, hash } = bcrypt;

export type E2EUserDocument = UserDocument & {
    __e2e__: { id?: string; password: string };
};

const createUser = async (e2eId?: string): Promise<E2EUserDocument> => {
    const password = faker.internet.password({
        length: 15,
        pattern: /[a-zA-Z0-9@!-'.;[\]]/,
    });

    const passwordChangedAt = faker.date.between({ from: dayjs().add(-80, 'days').toDate(), to: new Date() });
    const lastUsedAt = faker.date.between({ from: passwordChangedAt, to: new Date() });

    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);

    // base document
    const document: E2EUserDocument = {
        _id: new ObjectId(faker.database.mongodbObjectId()),
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        isSuperAdmin: false,
        authProfiles: [
            {
                _id: new ObjectId(faker.database.mongodbObjectId()),
                _type: 'local',
                password: passwordHash,
                passwordChangedAt,
                previousPasswords: [],
                lastUsedAt,
            },
        ],
        _caslType: 'User',
        __e2e__: {
            id: e2eId,
            password,
        },
    };

    return document;
};

export default createUser;
