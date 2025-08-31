import type { Meta, StoryObj } from '@storybook/react';
import DatePickerField from './index';
import withStorybookForm from '@/components/decorators/withStorybookForm';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';

const meta: Meta<typeof DatePickerField> = {
    title: 'Design System/Fields/DatePicker',
    component: DatePickerField,
    tags: ['autodocs'],
    decorators: [withStorybookForm, withStorybookTranslation()],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof DatePickerField>;

export const Default: Story = {
    args: {
        name: 'datePickerField',
        label: 'Starting Date',
    },
};

export default meta;
