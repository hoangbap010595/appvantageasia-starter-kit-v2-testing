import type { Meta, StoryObj } from '@storybook/react';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import Footer from './index';

const meta: Meta<typeof Footer> = {
    title: 'Design System/Blocks/Footer',
    component: Footer,
    decorators: [withStorybookTranslation],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
    args: {
        version: 'v1.0.0-next.111',
    },
};

export default meta;
