import type { Meta, StoryObj } from '@storybook/react';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import { SortingOrder } from './types';
import Table from './index';

const meta: Meta<typeof Table> = {
    title: 'Design System/Components/Table',
    component: Table,
    tags: ['autodocs'],
    decorators: [withStorybookTranslation],
    parameters: {
        layout: 'fullscreen',
    },
};

type Story = StoryObj<typeof Table>;

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
        title: 'Actions',
        dataIndex: '',
        key: 'actions',
        render: (value: any, record: any) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a className={`text-pink-400 focus:text-pink-500`} href="#">
                Edit<span className="sr-only">, {record.name}</span>
            </a>
        ),
    },
];

const dataSource = [
    {
        name: 'Lindsay Walton',
        title: 'Front-end Developer',
        email: 'lindsay.walton@example.com',
        role: 'Member',
    },
    {
        name: 'Lindsay Walton',
        title: 'Front-end Developer',
        email: 'lindsay.walton@example.com',
        role: 'Member',
    },
    {
        name: 'Lindsay Walton',
        title: 'Front-end Developer',
        email: 'lindsay.walton@example.com',
        role: 'Member',
    },
    {
        name: 'Lindsay Walton',
        title: 'Front-end Developer',
        email: 'lindsay.walton@example.com',
        role: 'Member',
    },
];

export const Default: Story = {
    args: {
        columns,
        dataSource,
    },
};

export const Striped: Story = {
    args: {
        columns,
        dataSource,
        striped: true,
    },
};

export const WithSorter: Story = {
    args: {
        columns: [
            { title: 'Name', dataIndex: 'name', key: 'name', sorter: true, sortOrder: SortingOrder.Asc },
            { title: 'Title', dataIndex: 'title', key: 'title', sorter: true, sortOrder: SortingOrder.Desc },
            { title: 'Email', dataIndex: 'email', key: 'email', sorter: true, sortOrder: null },
            { title: 'Role', dataIndex: 'role', key: 'role' },
        ],
        dataSource,
        striped: true,
    },
};

export default meta;
