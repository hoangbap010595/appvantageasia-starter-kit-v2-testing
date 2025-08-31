import type { Meta, StoryObj } from '@storybook/react';
import InputGroup from './index';
import StoryContentFiller from '@/components/common/StoryContentFiller';

const meta: Meta<typeof InputGroup> = {
    title: 'Design System/Components/InputGroup',
    component: InputGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
    args: {
        id: 'defaultInputGroup',
        label: 'Field',
        children: <StoryContentFiller height="5vh" width="200px" />,
    },
};

export const WithHelp: Story = {
    args: {
        id: 'withHelpInputGroup',
        label: 'Field',
        helpElement: 'Help message goes here',
        children: <StoryContentFiller height="5vh" width="200px" />,
    },
};

export const WithError: Story = {
    args: {
        id: 'withErrorInputGroup',
        label: 'Field',
        errorElement: 'Something went wrong',
        children: <StoryContentFiller height="5vh" width="200px" />,
    },
};

export default meta;
