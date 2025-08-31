import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-remix-react-router';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import Upload from './index';

const meta: Meta<typeof Upload> = {
    title: 'Design System/Components/Upload',
    component: Upload,
    decorators: [withRouter, withStorybookTranslation],
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Upload>;

export const Default: Story = {
    args: {},
};

export const HasPreview: Story = {
    args: {
        value: {
            preview: new URL('@/public/logo/square/black.svg', import.meta.url).href,
        },
    },
};

export default meta;
