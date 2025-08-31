import type { UserDocument } from '@appvantageasia/core-users';
import { patchAbilities as patchUserSystemAbilities } from '@appvantageasia/core-users';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import detectSubjectType from './detectSubjectType.js';

const createAbilities = async (user?: UserDocument | null) => {
    // get an ability builder tailored for mongodb
    const abilityBuilder = new AbilityBuilder(createMongoAbility);

    // run all builders
    await patchUserSystemAbilities(abilityBuilder, user);

    // finally build the ability object
    return abilityBuilder.build({ detectSubjectType });
};

export default createAbilities;
