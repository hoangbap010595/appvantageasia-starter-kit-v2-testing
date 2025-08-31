import type { UserDocument } from '@appvantageasia/core-users';
import { cacheAbilities, getAbilitiesCacheKey, getCachedAbilities } from './cache.js';
import createAbilities from './createAbilities.js';
import wrapAbilities from './wrapAbilities.js';

const getAbilities = async (user?: UserDocument | null) => {
    // build cache key first
    const cacheKey = getAbilitiesCacheKey(user?._id);

    // then look for cache
    const cachedAbilities = await getCachedAbilities(cacheKey);

    if (cachedAbilities) {
        // we can restore abilities from cache
        return wrapAbilities(cachedAbilities);
    }

    // create abilities
    const abilities = await createAbilities(user);

    // cache abilities
    await cacheAbilities(cacheKey, abilities);

    return wrapAbilities(abilities);
};

export default getAbilities;
