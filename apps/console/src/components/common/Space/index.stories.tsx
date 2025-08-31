import type { Meta, StoryObj } from '@storybook/react';
import Badge from '../Badge';
import Space from './index';

const meta: Meta<typeof Space> = {
    title: 'Design System/Components/Space',
    component: Space,
    // tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof Space>;

export const Horizontal: Story = {
    args: {
        children: (
            <>
                <Badge color="indigo" text="Badge" />
                <Badge color="pink" text="Badge" />
                <Badge color="indigo" text="Badge" />
                <Badge color="pink" text="Badge" />
            </>
        ),
    },
};

export const Vertical: Story = {
    args: {
        direction: 'vertical',
        children: (
            <>
                <Badge color="indigo" text="Badge" />
                <Badge color="pink" text="Badge" />
                <Badge color="indigo" text="Badge" />
                <Badge color="pink" text="Badge" />
            </>
        ),
    },
};

export default meta;
