import type { Meta, StoryObj } from '@storybook/react';
import Notification from './NotificationElement';

const meta: Meta<typeof Notification> = {
    title: 'Design System/Components/Notification',
    component: Notification,
    tags: ['autodocs'],
    parameters: {},
};

type Story = StoryObj<typeof Notification>;

export const Default: Story = {
    args: {
        notification: {
            id: 2,
            type: 'success',
            message: 'Successfully saved!',
        },
    },
};

export const NotificationWithDescription: Story = {
    args: {
        notification: {
            id: 0,
            type: 'success',
            message: 'Successfully saved!',
            description: 'Anyone with a link can now view this file.',
        },
    },
};

export const Error: Story = {
    args: {
        notification: {
            id: 12,
            type: 'error',
            message: 'Something is wrong',
        },
    },
};

export const Warning: Story = {
    args: {
        notification: {
            id: 21,
            type: 'warning',
            message: 'Something is required',
        },
    },
};

export const Info: Story = {
    args: {
        notification: {
            id: 42,
            type: 'info',
            message: 'Please note something will happen',
        },
    },
};
export default meta;
