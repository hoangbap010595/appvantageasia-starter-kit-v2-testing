import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { withRouter } from 'storybook-addon-remix-react-router';
import RequestNewPasswordForm from './Form';
import withStorybookForm from '@/components/decorators/withStorybookForm';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';

const meta: Meta<typeof RequestNewPasswordForm> = {
    title: 'Application/Forms/Request New Password',
    component: RequestNewPasswordForm,
    decorators: [withStorybookTranslation, withRouter, withStorybookForm],
    parameters: {
        layout: 'centered',
        form: { renderForm: false },
    },
};

type Story = StoryObj<typeof RequestNewPasswordForm>;

export const Default: Story = {
    args: {
        onSubmit: action('onSubmit'),
    },
};

export default meta;
