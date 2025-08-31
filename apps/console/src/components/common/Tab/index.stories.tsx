import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { withRouter } from 'storybook-addon-remix-react-router';
import Tab from './index';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';

const meta: Meta<typeof Tab> = {
    title: 'Design System/Components/Tab',
    component: Tab,
    decorators: [withRouter, withStorybookTranslation],
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Tab>;

export const Default: Story = {
    args: {
        tabs: [
            { name: 'My Account', href: '/users', key: 'My Account', current: false },
            { name: 'Company', current: false, key: 'Company' },
            { name: 'Team Members', current: true, key: 'Team Members' },
            { name: 'Billing', current: false, key: 'Billing' },
        ],
        onChange: action('onChange'),
    },
};

export default meta;
