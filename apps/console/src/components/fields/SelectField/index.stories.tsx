import type { Meta, StoryObj } from '@storybook/react';
import withStorybookForm from '../../decorators/withStorybookForm';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import SelectField from './index';

const meta: Meta<typeof SelectField> = {
    title: 'Design System/Fields/SelectField',
    component: SelectField,
    tags: ['autodocs'],
    decorators: [withStorybookForm, withStorybookTranslation],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof SelectField>;

const mock = [
    { value: 1, label: 'Wade Cooper', online: true },
    { value: 2, label: 'Arlene Mccoy', online: false },
    { value: 3, label: 'Devon Webb', online: false },
    { value: 4, label: 'Tom Cook', online: true },
    { value: 5, label: 'Tanya Fox', online: false },
    { value: 6, label: 'Hellen Schmvaluet', online: true },
    { value: 7, label: 'Caroline Schultz', online: true },
    { value: 8, label: 'Mason Heaney', online: false },
    { value: 9, label: 'Claudie Smitham', online: true },
    { value: 10, label: 'Emil Schaefer', online: false },
];

export const Default: Story = {
    args: {
        name: 'assignedTo',
        label: 'Assigned to',
        options: mock,
    },
};

export const Multiple: Story = {
    args: {
        name: 'assignedTo',
        label: 'Assigned to',
        options: mock,
        multiple: true,
    },
};

export default meta;
