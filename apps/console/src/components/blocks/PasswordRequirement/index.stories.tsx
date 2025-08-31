import type { Meta, StoryObj } from '@storybook/react';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import PasswordRequirement from './index';

const meta: Meta<typeof PasswordRequirement> = {
    title: 'Design System/Blocks/PasswordRequirement',
    component: PasswordRequirement,
    decorators: [withStorybookTranslation],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof PasswordRequirement>;

export const Default: Story = {
    args: {
        requirements: [
            { isChecked: false, description: 'At least 1 upper case letter [A-Z]' },
            { isChecked: true, description: 'At least 1 lower case letter [a-z]' },
            { isChecked: false, description: 'At least 1 numeral [0-9]' },
            { isChecked: true, description: `At least 1 special character [!@#^&*()={}[]';,.?-]` },
            { isChecked: false, description: 'At least 14 characters' },
        ],
    },
};

export default meta;
