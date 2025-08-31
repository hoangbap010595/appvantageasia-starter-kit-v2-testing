import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-remix-react-router';
import AuthenticatedNavBar from './index';
import withStorybookTenant, { tenantWithAdminRole } from '@/components/decorators/withStorybookTenant';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';
import withStorybookUser, { adminUser, createContext } from '@/components/decorators/withStorybookUser';

const meta: Meta<typeof AuthenticatedNavBar> = {
    title: 'Design System/Blocks/TenantNavBar',
    component: AuthenticatedNavBar,
    decorators: [withRouter, withStorybookTranslation, withStorybookUser, withStorybookTenant],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof AuthenticatedNavBar>;

export const Default: Story = {
    args: {},
    parameters: {
        user: createContext(adminUser),
        tenant: tenantWithAdminRole,
    },
};

export default meta;
