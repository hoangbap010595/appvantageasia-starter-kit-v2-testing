import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import withStorybookTranslation from '../../components/decorators/withStorybookTranslation';
import ConfirmModal from './ConfirmModal';

const meta: Meta<typeof ConfirmModal> = {
    title: 'Design System/Components/ConfirmModal',
    component: ConfirmModal,
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

type Story = StoryObj<typeof ConfirmModal>;

export const Default: Story = {
    args: {
        open: true,
        title: 'Confirm Modal',
        content: 'Confirmation description goes here',
        onConfirm: action('onConfirm'),
        onReject: action('onReject'),
    },
};

export default meta;
