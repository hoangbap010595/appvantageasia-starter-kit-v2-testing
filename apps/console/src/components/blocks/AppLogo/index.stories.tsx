import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-remix-react-router';
import AppLogo from './index';

const meta: Meta<typeof AppLogo> = {
    title: 'Design System/Blocks/AppLogo',
    component: AppLogo,
    decorators: [withRouter],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof AppLogo>;

export const Default: Story = {
    args: {},
};

export default meta;
