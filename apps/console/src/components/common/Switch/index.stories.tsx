import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import Switch from './index';

const meta: Meta<typeof Switch> = {
    title: 'Design System/Components/Switch',
    component: Switch,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
    args: {
        label: 'Switch',
        value: true,
        onChange: action('onChange'),
    },
};

export const Unchecked: Story = {
    args: {
        label: 'Switch',
        value: false,
        onChange: action('onChange'),
    },
};

export default meta;
