import type { Meta, StoryObj } from '@storybook/react';
import withStorybookForm from '../../decorators/withStorybookForm';
import InputField from './index';

const meta: Meta<typeof InputField> = {
    title: 'Design System/Fields/InputField',
    component: InputField,
    tags: ['autodocs'],
    decorators: [withStorybookForm],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof InputField>;

export const TextField: Story = {
    args: {
        name: 'testField',
        label: 'Test Field',
        helpElement: 'Value should should show with the key "testField" on submit action',
    },
};

export default meta;
