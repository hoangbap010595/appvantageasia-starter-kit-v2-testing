import type { Meta, StoryObj } from '@storybook/react';
import Number from './index';

const meta: Meta<typeof Number> = {
    title: 'Design System/Components/Number',
    component: Number,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Number>;

export const UntouchedNumber: Story = {
    args: {
        inputState: 'normal',
        name: 'field',
        label: 'Field',
        helpElement: 'Help message goes here',
    },
};

export default meta;
