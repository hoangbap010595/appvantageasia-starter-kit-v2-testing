import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import Button from './index';

const meta: Meta<typeof Button> = {
    title: 'Design System/Components/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    args: {
        onClick: action('onClick'),
    },
};

type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        disabled: false,
        children: 'Button',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        children: 'Button',
    },
};

export const Outline: Story = {
    args: {
        disabled: false,
        children: 'Button',
        outline: true,
    },
};

export const Plain: Story = {
    args: {
        disabled: false,
        children: 'Button',
        plain: true,
    },
};

export const Primary: Story = {
    args: {
        disabled: false,
        children: 'Button',
        color: 'primary',
    },
};

export default meta;
