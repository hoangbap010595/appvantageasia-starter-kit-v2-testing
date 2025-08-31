import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import ErrorComponent from './index';

const meta: Meta<typeof ErrorComponent> = {
    title: 'Design System/Blocks/Error',
    component: ErrorComponent,
    decorators: [withStorybookTranslation],
    parameters: {
        layout: 'fullscreen',
    },
};

type Story = StoryObj<typeof ErrorComponent>;

export const Default: Story = {
    args: {
        error: new Error('Something went wrong'),
        resetError: action('resetError'),
    },
};

export default meta;
