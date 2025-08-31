import type { ReactNode } from 'react';
import { makeDecorator } from 'storybook/preview-api';
import { TenantMembershipRole } from '@/apolloClient.types';
import type { Tenant } from '@/contexts/TenantContext';
import { Context } from '@/contexts/TenantContext';

export const tenantWithAdminRole: Tenant = {
    id: '682a97496358fbbf897675c9',
    name: 'Tenant',
    role: TenantMembershipRole.Admin,
    slug: 'tenantSlug',
    __typename: 'Tenant',
};

const withStorybookTenant = makeDecorator({
    name: 'withStorybookTenant',
    parameterName: 'tenant',
    wrapper: (getStory, context, { parameters }) => (
        <Context.Provider value={parameters as Tenant}>{getStory(context) as ReactNode}</Context.Provider>
    ),
});

export default withStorybookTenant;
