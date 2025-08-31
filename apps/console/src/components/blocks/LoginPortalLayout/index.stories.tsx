import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-remix-react-router';
import StoryContentFiller from '../../common/StoryContentFiller';
import LoginPortalLayout from './LoginPortalLayout';

const meta: Meta<typeof LoginPortalLayout> = {
    title: 'Design System/Layouts/LoginPortalLayout',
    component: LoginPortalLayout,
    decorators: [withRouter],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof LoginPortalLayout>;

export const WithTitle: Story = {
    args: {
        title: 'Sign In',
        children: <StoryContentFiller />,
    },
};

export const WithTitleAndDescription: Story = {
    args: {
        title: 'Authentication',
        description: 'A One-Time-Password has been sent to your mobile.',
        children: <StoryContentFiller />,
    },
};

export default meta;
