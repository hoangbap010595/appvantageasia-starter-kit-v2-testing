import type { Meta, StoryObj } from '@storybook/react';
import withStorybookForm from '../../decorators/withStorybookForm';
import OTPInputField from './index';

const meta: Meta<typeof OTPInputField> = {
    title: 'Design System/Fields/OTPInput',
    component: OTPInputField,
    tags: ['autodocs'],
    decorators: [withStorybookForm],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof OTPInputField>;

export const OTPInput: Story = {
    args: { index: 0, autoFocus: true },
};

export default meta;
