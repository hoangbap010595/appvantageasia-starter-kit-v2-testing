import type { Meta, StoryObj } from '@storybook/react';
import Typography from './index';

const meta: Meta<typeof Typography> = {
    title: 'Design System/Components/Typography',
    component: Typography,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        as: {
            control: 'select',
            options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'p', 'span'],
            description: 'HTML element to render',
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary', 'success', 'danger', 'warning', 'help'],
            description: 'Text color variation',
        },
        children: {
            control: 'text',
            description: 'Text content',
        },
    },
};

type Story = StoryObj<typeof meta>;

// Basic story with default props
export const Default: Story = {
    args: {
        children: 'Default Typography Text',
    },
};

// Heading examples
export const Heading1: Story = {
    args: {
        as: 'h1',
        children: 'Heading 1',
    },
};

export const Heading2: Story = {
    args: {
        as: 'h2',
        children: 'Heading 2',
    },
};

export const Heading3: Story = {
    args: {
        as: 'h3',
        children: 'Heading 3',
    },
};

// Color variations
export const PrimaryColor: Story = {
    args: {
        color: 'primary',
        children: 'Primary colored text',
    },
};

export const SecondaryColor: Story = {
    args: {
        color: 'secondary',
        children: 'Secondary colored text',
    },
};

export const SuccessColor: Story = {
    args: {
        color: 'success',
        children: 'Success colored text',
    },
};

export const DangerColor: Story = {
    args: {
        color: 'danger',
        children: 'Danger colored text',
    },
};

// Combined variations
export const HeadingWithCustomColor: Story = {
    args: {
        as: 'h2',
        color: 'primary',
        children: 'Heading with primary color',
    },
};

// Example showcasing all typography variants
export const AllVariants: Story = {
    render: () => (
        <div className="space-y-4">
            <Typography as="h1">Heading 1</Typography>
            <Typography as="h2">Heading 2</Typography>
            <Typography as="h3">Heading 3</Typography>
            <Typography as="h4">Heading 4</Typography>
            <Typography as="h5">Heading 5</Typography>
            <Typography as="h6">Heading 6</Typography>
            <Typography as="p">Paragraph text</Typography>
            <Typography as="div">Div text</Typography>
            <Typography as="span">Span text</Typography>
            <Typography color="primary">Primary color</Typography>
            <Typography color="secondary">Secondary color</Typography>
            <Typography color="success">Success color</Typography>
            <Typography color="danger">Danger color</Typography>
            <Typography color="warning">Warning color</Typography>
            <Typography color="help">Help color</Typography>
        </div>
    ),
};

export default meta;
