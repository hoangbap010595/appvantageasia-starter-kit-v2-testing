import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import ProgressBar from '../ProgressBar';
import Alert from './index';

const meta: Meta<typeof Alert> = {
    title: 'Design System/Components/Alert',
    component: Alert,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Alert>;

export const Warning: Story = {
    args: {
        type: 'warning',
        title: 'Attention needed',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.',
    },
};

export const WarningOnlyTitle: Story = {
    args: {
        type: 'warning',
        title: 'Attention needed',
    },
};

export const WarningWithText: Story = {
    args: {
        type: 'warning',
        text: (
            <>
                You have no credits left.{' '}
                <a className="font-medium text-yellow-700 underline hover:text-yellow-600" href="/">
                    Upgrade your account to add more credits.
                </a>
            </>
        ),
    },
};

export const Error: Story = {
    args: {
        type: 'error',
        title: 'There were 2 errors with your submission',
        description: [
            'Your password must be at least 8 characters',
            'Your password must include at least one pro wrestling finishing move',
        ],
    },
};

export const Success: Story = {
    args: {
        type: 'success',
        title: 'Order completed',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam.',
        actions: [
            { text: 'View status', onAction: fn() },
            { text: 'Dismiss', onAction: fn() },
        ],
    },
};

export const Notice: Story = {
    args: {
        type: 'notice',
        title: 'A new software update is available. See what’s new in version 2.0.4.',
    },
};

export const NoticeWithDismiss: Story = {
    args: {
        type: 'notice',
        title: 'A new software update is available. See what’s new in version 2.0.4.',
        onDismiss: fn(),
    },
};

export const NoticeWithAccentBorder: Story = {
    args: {
        type: 'notice',
        title: 'A new software update is available. See what’s new in version 2.0.4.',
        hasAccentBorder: true,
    },
};

export const NoticeWithRightLink: Story = {
    args: {
        type: 'notice',
        rightLink: {
            description: 'A new software update is available. See what’s new in version 2.0.4.',
            text: 'Detail',
            url: '#',
        },
    },
};

export const Progress: Story = {
    args: {
        type: 'notice',
        title: 'Processing Contracts',
        description: <ProgressBar value={60} />,
    },
};

export default meta;
