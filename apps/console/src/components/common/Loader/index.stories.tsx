import type { Meta, StoryObj } from '@storybook/react';
import Loader from './index';

const meta: Meta<typeof Loader> = {
    title: 'Design System/Components/Loader',
    component: Loader,
    tags: ['autodocs'],
};

type Story = StoryObj<typeof Loader>;

export const Default: Story = {
    args: {},
    parameters: {
        layout: 'centered',
    },
};

export const FullScreen: Story = {
    args: {
        height: 'screen',
    },
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
