import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { withRouter } from 'storybook-addon-remix-react-router';
import SignIn from './Form';
import withStorybookForm from '@/components/decorators/withStorybookForm';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';

const meta: Meta<typeof SignIn> = {
    title: 'Application/Forms/SignIn',
    component: SignIn,
    decorators: [withStorybookTranslation, withRouter, withStorybookForm],
    parameters: {
        layout: 'centered',
        form: { renderForm: false },
    },
};

type Story = StoryObj<typeof SignIn>;

export const Default: Story = {
    args: {
        onSubmit: action('onSubmit'),
    },
};

export default meta;
