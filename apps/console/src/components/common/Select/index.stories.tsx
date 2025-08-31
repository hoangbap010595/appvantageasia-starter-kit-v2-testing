import type { Meta, StoryObj } from '@storybook/react';
import Select from './index';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';

const meta: Meta<typeof Select> = {
    title: 'Design System/Components/Select',
    component: Select,
    tags: ['autodocs'],
    decorators: [withStorybookTranslation],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Select>;

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
        label: 'Assigned to',
        options: mock,
    },
};

export const WithValue: Story = {
    args: {
        label: 'Assigned to',
        options: mock,
        value: 8,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Assigned to',
        options: mock,
        disabled: true,
        value: 8,
    },
};

export const MultiSelect: Story = {
    args: {
        label: 'Assigned to',
        options: mock,
        value: [8, 2],
        multiple: true,
    },
};

export default meta;
