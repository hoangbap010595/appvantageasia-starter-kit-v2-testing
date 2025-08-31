import type { Meta, StoryObj } from '@storybook/react';
import withStorybookForm from '../../decorators/withStorybookForm';
import CheckboxField from './index';

const meta: Meta<typeof CheckboxField> = {
    title: 'Design System/Fields/Checkbox',
    component: CheckboxField,
    tags: ['autodocs'],
    decorators: [withStorybookForm],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof CheckboxField>;

export const CheckboxGroup: Story = {
    args: {
        name: 'checkboxField',
        label: 'I am a consent',
    },
};

export default meta;
