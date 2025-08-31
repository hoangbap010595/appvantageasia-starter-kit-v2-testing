import type { AbilityBuilder, MongoAbility } from '@casl/ability';
import { type UserDocument } from './getCollections.js';

const patchAbilities = async (abilityBuilder: AbilityBuilder<MongoAbility>, user?: UserDocument | null) => {
    const { can } = abilityBuilder;

    if (user) {
        // user can see and read his own sensitive information
        can(['readSensitive', 'updateSensitive'], 'User', { _id: user._id });

        if (user.isSuperAdmin) {
            can(['manage'], 'User');
            can(['manage'], 'System');
        }
    }
};

export default patchAbilities;
