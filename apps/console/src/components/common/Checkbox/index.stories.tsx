import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './index';

const meta: Meta<typeof Checkbox> = {
    title: 'Design System/Components/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {
        name: 'checkbox',
        label: 'I am checkbox',
        defaultChecked: false,
    },
};

export const Disabled: Story = {
    args: {
        name: 'checkbox',
        label: 'I am checkbox',
        defaultChecked: false,
        disabled: true,
    },
};

export const Checked: Story = {
    args: {
        name: 'checkbox',
        label: 'I am checkbox',
        defaultChecked: true,
    },
};

export const CheckedDisabled: Story = {
    args: {
        name: 'checkbox',
        label: 'I am checkbox',
        defaultChecked: true,
        disabled: true,
    },
};

export default meta;
