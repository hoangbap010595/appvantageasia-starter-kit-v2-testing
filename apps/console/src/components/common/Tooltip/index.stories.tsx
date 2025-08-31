import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from './index';

const meta: Meta<typeof Tooltip> = {
    title: 'Design System/Components/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
    args: {
        children: 'Tooltip',
        title: (
            <div>
                <div>Changing the URL slug can cause broken links and may require users to re-sign in.</div>
                <div>Changing the URL slug can cause broken links and may require users to re-sign in.</div>
                <div>Changing the URL slug can cause broken links and may require users to re-sign in.</div>
            </div>
        ),
    },
};

export const Small: Story = {
    args: {
        children: 'Tooltip',
        title: 'Changing the URL',
    },
};

export default meta;
