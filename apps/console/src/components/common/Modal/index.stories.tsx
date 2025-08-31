import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import StoryContentFiller from '../StoryContentFiller';
import Modal from './index';

const meta: Meta<typeof Modal> = {
    title: 'Design System/Components/Modal',
    component: Modal,
    tags: ['autodocs'],
    decorators: [withStorybookTranslation],
    parameters: {
        layout: 'fullscreen',
        docs: {
            story: {
                inline: false,
                iframeHeight: 500,
            },
        },
    },
};

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
    args: {
        open: true,
        title: 'Modal',
        children: <StoryContentFiller />,
        onClose: action('onClose'),
        onCancel: action('onCancel'),
        onOk: action('onOk'),
    },
};

export const WithNoTitle: Story = {
    args: {
        open: true,
        children: <StoryContentFiller />,
        onClose: action('onClose'),
        onCancel: action('onCancel'),
        onOk: action('onOk'),
    },
};

export const WithCustomizedWidth: Story = {
    args: {
        open: true,
        children: <StoryContentFiller />,
        className: '!w-full !max-w-full',
        onClose: action('onClose'),
        onCancel: action('onCancel'),
        onOk: action('onOk'),
    },
};

export default meta;
