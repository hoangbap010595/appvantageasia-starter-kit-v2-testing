import type { Meta, StoryObj } from '@storybook/react';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import CopyInput from './index';

const meta: Meta<typeof CopyInput> = {
    title: 'Design System/Components/CopyInput',
    component: CopyInput,
    decorators: [withStorybookTranslation],
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof CopyInput>;

export const WithURLContent: Story = {
    args: {
        value: 'http://whatever.domain.co',
    },
};

export default meta;
