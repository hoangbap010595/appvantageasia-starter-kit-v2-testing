import type { Meta, StoryObj } from '@storybook/react';
import withStorybookForm from '../../decorators/withStorybookForm';
import TextareaField from './index';

const meta: Meta<typeof TextareaField> = {
    title: 'Design System/Fields/TextareaField',
    component: TextareaField,
    tags: ['autodocs'],
    decorators: [withStorybookForm],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof TextareaField>;

export const Textarea: Story = {
    args: {
        name: 'testField',
        label: 'Test Field',
        helpElement: 'Value should should show with the key "testField" on submit action',
    },
};

export default meta;
