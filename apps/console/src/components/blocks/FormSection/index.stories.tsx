import type { Meta, StoryObj } from '@storybook/react';
import Input from '../../common/Input';
import Select from '../../common/Select';
import withStorybookTranslation from '../../decorators/withStorybookTranslation';
import FormSection, { ColItem } from './index';

const meta: Meta<typeof FormSection> = {
    title: 'Design System/Blocks/FormSection',
    component: FormSection,
    decorators: [withStorybookTranslation],
    parameters: {
        layout: 'fullscreen',
    },
};

type Story = StoryObj<typeof FormSection>;

export const Default: Story = {
    args: {
        title: 'Profile',
        children: (
            <>
                <ColItem>
                    <Input label="test1" name="test1" />
                </ColItem>
                <ColItem>
                    <Select label="test2" name="test2" options={[]} />
                </ColItem>
                <ColItem>
                    <Input label="test3" name="test3" />
                </ColItem>
                <ColItem>
                    <Select label="test4" name="test4" options={[]} />
                </ColItem>
            </>
        ),
    },
};

export const WithDescription: Story = {
    args: {
        title: 'Profile',
        description: 'This information will be displayed publicly so be careful what you share.',
        children: (
            <>
                <ColItem>
                    <Input label="test1" name="test1" />
                </ColItem>
                <ColItem>
                    <Select label="test2" name="test2" options={[]} />
                </ColItem>
                <ColItem>
                    <Input label="test3" name="test3" />
                </ColItem>
                <ColItem>
                    <Select label="test4" name="test4" options={[]} />
                </ColItem>
            </>
        ),
    },
};

export default meta;
