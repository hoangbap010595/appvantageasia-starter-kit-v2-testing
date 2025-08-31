import { getCollections } from '@appvantageasia/core-tenants';
import type { GqlQueryResolvers } from '../../resolver-types.js';

const resolver: GqlQueryResolvers['tenantBySlug'] = async (root, { slug }) => {
    const { tenants } = await getCollections();

    return tenants.findOne({ slug: slug.toLowerCase() });
};

export default resolver;
