import type { Meta, StoryObj } from '@storybook/react';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import UploadButton from './index';

const meta: Meta<typeof UploadButton> = {
    title: 'Design System/Components/UploadButton',
    component: UploadButton,
    decorators: [withStorybookTranslation],
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof UploadButton>;

export const Default: Story = {
    args: {
        label: 'Upload',
        accept: '.csv',
    },
};

export default meta;
