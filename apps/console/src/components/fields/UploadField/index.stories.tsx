import type { Meta, StoryObj } from '@storybook/react';
import withStorybookForm from '../../decorators/withStorybookForm';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import UploadField from './index';

const meta: Meta<typeof UploadField> = {
    title: 'Design System/Fields/UploadField',
    component: UploadField,
    tags: ['autodocs'],
    decorators: [withStorybookForm, withStorybookTranslation],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof UploadField>;

export const Default: Story = {
    args: {
        name: 'logo',
        label: 'Logo',
    },
};

export default meta;
