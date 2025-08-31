import { createLazyGetter } from '@appvantageasia/core-node-utils';
import { type UserDocument } from '@appvantageasia/core-users';
import getAbilities from './getAbilities.js';
import { type WrappedAbilities } from './wrapAbilities.js';

const createLazyUserAbility = (user?: UserDocument | null) =>
    createLazyGetter<WrappedAbilities>(() => getAbilities(user));

export default createLazyUserAbility;

export type LazyUserAbility = ReturnType<typeof createLazyUserAbility>;
