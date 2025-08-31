import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import Pagination from './index';

const meta: Meta<typeof Pagination> = {
    title: 'Design System/Components/Pagination',
    component: Pagination,
    decorators: [withStorybookTranslation],
    parameters: {
        layout: 'fullscreen',
    },
};

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
    args: {
        current: 5,
        pageSize: 10,
        total: 80,
        onChange: action(`onPageChange`),
    },
};

export default meta;
