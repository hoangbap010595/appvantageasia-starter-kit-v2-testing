import type { Meta, StoryObj } from '@storybook/react';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import InlineCode from './index';

const meta: Meta<typeof InlineCode> = {
    title: 'Design System/Components/InlineCode',
    component: InlineCode,
    decorators: [withStorybookTranslation],
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof InlineCode>;

export const WithURLContent: Story = {
    args: {
        children: 'http://whatever.domain.co',
    },
};

export default meta;
