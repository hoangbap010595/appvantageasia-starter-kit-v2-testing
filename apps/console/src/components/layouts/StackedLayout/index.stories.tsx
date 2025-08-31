import type { Meta, StoryObj } from '@storybook/react';
import { withRouter, reactRouterParameters, reactRouterOutlet } from 'storybook-addon-remix-react-router';
import StackedLayout from './index';
import SystemNavBar from '@/components/blocks/SystemNavBar';
import SystemSideBar from '@/components/blocks/SystemSideBar';
import TenantNavBar from '@/components/blocks/TenantNavBar';
import TenantSideBar from '@/components/blocks/TenantSideBar';
import StoryContentFiller from '@/components/common/StoryContentFiller';
import withStorybookTenant, { tenantWithAdminRole } from '@/components/decorators/withStorybookTenant';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';
import withStorybookUser, { adminUser, createContext } from '@/components/decorators/withStorybookUser';

const meta: Meta<typeof StackedLayout> = {
    title: 'Design System/Layouts/StackedLayout',
    component: StackedLayout,
    decorators: [withRouter, withStorybookTranslation, withStorybookUser, withStorybookTenant],
    parameters: {
        layout: 'fullscreen',
    },
};

type Story = StoryObj<typeof StackedLayout>;

export const TenantLayout: Story = {
    args: {
        navbar: <TenantNavBar />,
        sidebar: <TenantSideBar />,
    },
    parameters: {
        user: createContext(adminUser),
        reactRouter: reactRouterParameters({
            routing: reactRouterOutlet(<StoryContentFiller />),
        }),
        tenant: tenantWithAdminRole,
    },
};

export const SystemConsoleLayout: Story = {
    args: {
        navbar: <SystemNavBar />,
        sidebar: <SystemSideBar />,
    },
    parameters: {
        user: createContext(adminUser),
        reactRouter: reactRouterParameters({
            routing: reactRouterOutlet(<StoryContentFiller />),
        }),
        tenant: null,
    },
};

export default meta;
