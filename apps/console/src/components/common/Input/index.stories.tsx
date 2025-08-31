import { EnvelopeIcon } from '@heroicons/react/20/solid';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import Input from './index';

const meta: Meta<typeof Input> = {
    title: 'Design System/Components/Input',
    component: Input,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Input>;

export const UntouchedInput: Story = {
    args: {
        inputState: 'normal',
        name: 'field',
        label: 'Field',
        type: 'text',
        helpElement: 'Help message goes here',
        placeholder: 'type something here',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        inputState: 'normal',
        name: 'field',
        label: 'Field',
        type: 'text',
        value: 'current value',
    },
};

export const InvalidState: Story = {
    args: {
        inputState: 'invalid',
        name: 'field',
        label: 'Field',
        type: 'text',
        errorElement: 'Something went wrong',
        value: 'invalid value',
    },
};

export const ValidState: Story = {
    args: {
        inputState: 'valid',
        name: 'field',
        label: 'Field',
        type: 'text',
        value: 'valid value',
    },
};

export const WithPrefix: Story = {
    args: {
        inputState: 'normal',
        name: 'field',
        label: 'Field',
        type: 'text',
        value: 'dummy@domain.co',
        prefixElement: <EnvelopeIcon aria-hidden="true" className="size-5" />,
    },
};

export const WithSuffix: Story = {
    args: {
        inputState: 'normal',
        name: 'field',
        label: 'Field',
        type: 'text',
        value: 'dummy@domain.co',
        suffixElement: <EnvelopeIcon aria-hidden="true" className="size-5" />,
    },
};

export const WithSuffixClickable: Story = {
    args: {
        inputState: 'normal',
        name: 'field',
        label: 'Field',
        type: 'text',
        value: 'dummy@domain.co',
        suffixElement: <EnvelopeIcon aria-hidden="true" className="size-5" />,
        onSuffixClick: action('onClick'),
    },
};

export default meta;
