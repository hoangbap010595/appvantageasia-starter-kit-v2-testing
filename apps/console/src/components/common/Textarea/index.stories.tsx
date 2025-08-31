import { EnvelopeIcon } from '@heroicons/react/20/solid';
import type { Meta, StoryObj } from '@storybook/react';
import Textarea from './index';

const meta: Meta<typeof Textarea> = {
    title: 'Design System/Components/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Textarea>;

export const UntouchedTextarea: Story = {
    args: {
        inputState: 'normal',
        name: 'field',
        label: 'Field',
        helpElement: 'Help message goes here',
        placeholder: 'type something here',
    },
};

export const InvalidState: Story = {
    args: {
        inputState: 'invalid',
        name: 'field',
        label: 'Field',
        errorElement: 'Something went wrong',
        value: 'invalid value',
    },
};

export const ValidState: Story = {
    args: {
        inputState: 'valid',
        name: 'field',
        label: 'Field',
        value: 'valid value',
    },
};

export const WithPrefix: Story = {
    args: {
        inputState: 'normal',
        name: 'field',
        label: 'Field',
        value: 'dummy@domain.co',
        prefixElement: <EnvelopeIcon aria-hidden="true" className="size-5 text-gray-400" />,
    },
};

export default meta;
