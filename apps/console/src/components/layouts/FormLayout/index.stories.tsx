import type { Meta, StoryObj } from '@storybook/react';
import { withRouter, reactRouterParameters, reactRouterOutlet } from 'storybook-addon-remix-react-router';
import FormLayout from './index';
import FormSection, { ColItem } from '@/components/blocks/FormSection';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import StoryContentFiller from '@/components/common/StoryContentFiller';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';

const meta: Meta<typeof FormLayout> = {
    title: 'Design System/Layouts/FormLayout',
    component: FormLayout,
    decorators: [withRouter, withStorybookTranslation],
    parameters: {
        layout: 'fullscreen',
    },
};

type Story = StoryObj<typeof FormLayout>;

export const Default: Story = {
    args: {
        children: (
            <>
                <FormSection
                    description="This information will be displayed publicly so be careful what you share."
                    title="Profile"
                >
                    <ColItem>
                        <Input label="test1" name="test1" />
                    </ColItem>
                    <ColItem>
                        <Select label="test2" options={[]} name="test2" />
                    </ColItem>
                </FormSection>
                <FormSection title="Personal Information">
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
                        <Select label="test4" options={[]} name="test4" />
                    </ColItem>
                </FormSection>
            </>
        ),
    },
    parameters: {
        reactRouter: reactRouterParameters({
            routing: reactRouterOutlet(<StoryContentFiller />),
        }),
    },
};

export const WithActions: Story = {
    args: {
        actions: (
            <>
                <Button>Cancel</Button>
                <Button color="primary" type="submit">
                    Save
                </Button>
            </>
        ),
        children: (
            <FormSection title="Personal Information">
                <ColItem>
                    <Input label="test1" name="test1" />
                </ColItem>
                <ColItem>
                    <Select label="test2" name="test2" options={[]} />
                </ColItem>
                <ColItem>
                    <Input label="test3" name="test1" />
                </ColItem>
                <ColItem>
                    <Select label="test4" name="test4" options={[]} />
                </ColItem>
            </FormSection>
        ),
    },
    parameters: {
        reactRouter: reactRouterParameters({
            routing: reactRouterOutlet(<StoryContentFiller />),
        }),
    },
};

export default meta;
