import { type TenantDocument } from '@appvantageasia/core-tenants';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

export type E2ETenantDocument = TenantDocument & {
    __e2e__: { id?: string };
};

const createUser = async (e2eId?: string): Promise<E2ETenantDocument> => {
    const name = faker.company.name();

    const document: E2ETenantDocument = {
        _id: new ObjectId(faker.database.mongodbObjectId()),
        name,
        slug: faker.helpers.slugify(name).toLowerCase(),
        users: [],
        _caslType: 'Tenant',
        __e2e__: { id: e2eId },
    };

    return document;
};

export default createUser;
