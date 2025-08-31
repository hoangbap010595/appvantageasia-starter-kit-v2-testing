import type { Meta, StoryObj } from '@storybook/react';
import QrCodeImage from './index';

const meta: Meta<typeof QrCodeImage> = {
    title: 'Design System/Blocks/QrCodeImage',
    component: QrCodeImage,
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof QrCodeImage>;

export const Default: Story = {
    args: {
        data: 'xxx',
    },
};

export default meta;
