import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-remix-react-router';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import NotFound from './index';

const meta: Meta<typeof NotFound> = {
    title: 'Design System/Blocks/NotFound',
    component: NotFound,
    decorators: [withRouter, withStorybookTranslation],
    parameters: {
        layout: 'fullscreen',
    },
};

type Story = StoryObj<typeof NotFound>;

export const Default: Story = {
    args: {},
};

export default meta;
