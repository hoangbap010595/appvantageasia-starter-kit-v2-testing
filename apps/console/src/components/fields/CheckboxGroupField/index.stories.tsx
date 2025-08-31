import type { Meta, StoryObj } from '@storybook/react';
import withStorybookForm from '../../decorators/withStorybookForm';
import CheckboxGroupField from './index';

const meta: Meta<typeof CheckboxGroupField> = {
    title: 'Design System/Fields/CheckboxGroup',
    component: CheckboxGroupField,
    tags: ['autodocs'],
    decorators: [withStorybookForm],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof CheckboxGroupField>;

export const CheckboxGroup: Story = {
    args: {
        name: 'checkboxGroupField',
        options: [
            { label: 'User', value: 1, disabled: true },
            { label: 'Role', value: 2 },
            { label: 'Group', value: 3 },
        ],
    },
};

export default meta;
