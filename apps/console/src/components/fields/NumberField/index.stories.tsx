import type { Meta, StoryObj } from '@storybook/react';
import withStorybookForm from '../../decorators/withStorybookForm';
import NumberField from './index';

const meta: Meta<typeof NumberField> = {
    title: 'Design System/Fields/NumberField',
    component: NumberField,
    tags: ['autodocs'],
    decorators: [withStorybookForm],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof NumberField>;

export const Default: Story = {
    args: {
        name: 'testField',
        label: 'Test Field',
        helpElement: 'Value should should show with the key "testField" on submit action',
    },
};

export default meta;
