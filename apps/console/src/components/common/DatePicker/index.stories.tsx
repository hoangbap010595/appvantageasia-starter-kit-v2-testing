import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import DatePicker from './index';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';

const meta: Meta<typeof DatePicker> = {
    title: 'Design System/Components/DatePicker',
    component: DatePicker,
    tags: ['autodocs'],
    decorators: [withStorybookTranslation],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof DatePicker>;

const onChange = action('onChange');

export const Default: Story = {
    args: {
        label: 'Date',
        helpElement: 'Help message goes here',
        onChange,
    },
};

export const ValidState: Story = {
    args: {
        label: 'Date',
        inputState: 'valid',
        value: new Date(),
        onChange,
    },
};

export const InvalidState: Story = {
    args: {
        label: 'Date',
        inputState: 'invalid',
        errorElement: 'Something went wrong',
        value: new Date(),
        onChange,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Date',
        disabled: true,
        value: new Date(),
        onChange,
    },
};

export default meta;
