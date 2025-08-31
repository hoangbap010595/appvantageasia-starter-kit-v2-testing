import type { Meta, StoryObj } from '@storybook/react';
import withStorybookForm from '../../decorators/withStorybookForm';
import PasswordField from './index';

const meta: Meta<typeof PasswordField> = {
    title: 'Design System/Fields/Password',
    component: PasswordField,
    tags: ['autodocs'],
    decorators: [withStorybookForm],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof PasswordField>;

export const Password: Story = {
    args: {
        name: 'password',
        showEye: false,
        placeholder: 'Password',
        label: 'Test Field',
    },
};

export default meta;
