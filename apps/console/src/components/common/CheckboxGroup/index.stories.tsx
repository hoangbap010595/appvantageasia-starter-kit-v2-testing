import type { Meta, StoryObj } from '@storybook/react';
import CheckboxGroup from './index';

const meta: Meta<typeof CheckboxGroup> = {
    title: 'Design System/Components/CheckboxGroup',
    component: CheckboxGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
    args: {
        name: 'checkboxGroup',
        options: [
            { label: '1', value: 1, disabled: true },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
        ],
        value: [1, 2],
    },
};

export default meta;
