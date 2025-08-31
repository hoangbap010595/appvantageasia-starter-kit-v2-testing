import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import Form from './Form';
import withStorybookForm from '@/components/decorators/withStorybookForm';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';

const meta: Meta<typeof Form> = {
    title: 'Application/Forms/TOTP Confirmation',
    component: Form,
    decorators: [withStorybookTranslation, withStorybookForm],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Form>;

export const Default: Story = {
    args: {
        onSubmit: action('onSubmit'),
    },
};

export default meta;
