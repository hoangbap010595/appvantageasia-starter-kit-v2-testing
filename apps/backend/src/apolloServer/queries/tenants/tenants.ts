import { requiresLoggedUser } from '../../decorators.js';
import type { GqlQueryResolvers } from '../../resolver-types.js';

const resolver: GqlQueryResolvers['tenants'] = requiresLoggedUser<GqlQueryResolvers['tenants']>(async () => {
    return [];
});

export default resolver;
