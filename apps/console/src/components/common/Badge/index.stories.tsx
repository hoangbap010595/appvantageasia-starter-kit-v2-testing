import type { Meta, StoryObj } from '@storybook/react';
import Badge from './index';

const meta: Meta<typeof Badge> = {
    title: 'Design System/Components/Badge',
    component: Badge,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Badge>;

export const Red: Story = {
    args: {
        color: 'red',
        text: 'Badge',
    },
};

export const Gray: Story = {
    args: {
        color: 'gray',
        text: 'Badge',
    },
};

export default meta;
