import type { Meta, StoryObj } from '@storybook/react';
import Input from '../../common/Input';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import FormItem from './index';

const meta: Meta<typeof FormItem> = {
    title: 'Design System/Blocks/FormItem',
    component: FormItem,
    decorators: [withStorybookTranslation],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof FormItem>;

export const Default: Story = {
    args: {
        label: 'Profile',
        children: <Input name="test1" />,
    },
};

export default meta;
