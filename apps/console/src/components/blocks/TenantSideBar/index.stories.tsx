import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-remix-react-router';
import AuthenticatedSideBar from './index';
import withStorybookTenant, { tenantWithAdminRole } from '@/components/decorators/withStorybookTenant';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';
import withStorybookUser, { adminUser, createContext } from '@/components/decorators/withStorybookUser';

const meta: Meta<typeof AuthenticatedSideBar> = {
    title: 'Design System/Blocks/TenantSideBar',
    component: AuthenticatedSideBar,
    decorators: [withRouter, withStorybookTranslation, withStorybookUser, withStorybookTenant],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof AuthenticatedSideBar>;

export const Default: Story = {
    args: {},
    parameters: {
        user: createContext(adminUser),
        tenant: tenantWithAdminRole,
    },
};

export default meta;
