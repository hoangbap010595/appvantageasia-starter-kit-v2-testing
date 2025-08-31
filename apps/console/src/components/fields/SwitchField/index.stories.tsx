import type { Meta, StoryObj } from '@storybook/react';
import withStorybookForm from '../../decorators/withStorybookForm';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import SwitchField from './index';

const meta: Meta<typeof SwitchField> = {
    title: 'Design System/Fields/SwitchField',
    component: SwitchField,
    tags: ['autodocs'],
    decorators: [withStorybookForm, withStorybookTranslation],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof SwitchField>;

export const Default: Story = {
    args: {
        name: 'switch',
        label: 'Switch',
    },
};

export default meta;
