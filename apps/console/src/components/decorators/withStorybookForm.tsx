import { type ReactNode, useEffect, useRef } from 'react';
import type { UseFormProps } from 'react-hook-form';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { action } from 'storybook/actions';
import { makeDecorator } from 'storybook/preview-api';

interface FormDecoratorProps {
    formArguments: UseFormProps & { renderForm?: boolean };
    children: ReactNode;
}

const onSubmit = action('onSubmit');
const onChange = action('onChange');

const FormDecorator = ({ formArguments: { renderForm = true, ...formArguments }, children }: FormDecoratorProps) => {
    const form = useForm(formArguments);

    const values = useWatch(form);
    const isInitialSkipped = useRef(false);

    useEffect(() => {
        if (isInitialSkipped.current) {
            onChange(values);
        }
        isInitialSkipped.current = true;
    }, [values, isInitialSkipped]);

    return (
        <FormProvider {...form}>
            {renderForm ? <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form> : children}
        </FormProvider>
    );
};

const withStorybookForm = makeDecorator({
    name: 'withStorybookForm',
    parameterName: 'form',
    wrapper: (getStory, context, { parameters }) => (
        <FormDecorator formArguments={parameters || {}}>{getStory(context) as ReactNode}</FormDecorator>
    ),
});

export default withStorybookForm;
