import isDeepEqual from 'fast-deep-equal';
import { useMemo, useEffect } from 'react';
import type { DeepPartialSkipArrayKey } from 'react-hook-form';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MSALConfiguration from './MSALConfiguration';
import OIDCConfiguration from './OIDCConfiguration';
import SSOBehaviorSection from './SSOBehaviorSection';
import SSOTypeField from './SSOTypeField';
import type { GetSsoQueryHookResult, SsoConfigurationDataFragment } from './UpdateSSO.api';
import useDefaultValues from './useDefaultValues';
import useFormSchema, { type InputValues, type OutputValues } from './useFormSchema';
import useOnSubmit from './useOnSubmit';
import FormSection, { ColItem } from '@/components/blocks/FormSection';
import Button from '@/components/common/Button';
import FormLayout from '@/components/layouts/FormLayout';

export interface SSOFormProps {
    initialSSO: SsoConfigurationDataFragment | null;
    refetch: GetSsoQueryHookResult['refetch'];
}

const resolveSSOValue = (values: DeepPartialSkipArrayKey<InputValues>) => {
    if (values.msal) {
        return 'msal';
    }

    if (values.oidc) {
        return 'oidc';
    }

    return 'none';
};

const SSOForm = ({ refetch, initialSSO }: SSOFormProps) => {
    const { t } = useTranslation(['common', 'system']);

    // prepare the form
    const defaultValues = useDefaultValues(initialSSO);
    const resolver = useFormSchema(t);
    const form = useForm<InputValues, any, OutputValues>({ resolver, defaultValues });
    const { formState, control, reset } = form;

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const onSubmit = useOnSubmit(t, refetch, form.setError);
    const values = useWatch({ control });
    const hasChanged = useMemo(() => !isDeepEqual(values, control._defaultValues), [control, values]);

    const defaultSSOType = resolveSSOValue(defaultValues);
    const ssoType = resolveSSOValue(values);

    return (
        <FormProvider {...form}>
            <form data-cy="organizationSSOForm" onSubmit={form.handleSubmit(onSubmit)}>
                <FormLayout
                    actions={
                        <Button color="primary" disabled={formState.isSubmitting || !hasChanged} type="submit">
                            {t(`system:actions.${formState.isSubmitting ? 'updating' : 'update'}`)}
                        </Button>
                    }
                >
                    <FormSection title={t('system:sections.ssoImplementation.title')}>
                        <ColItem className="sm:col-span-full">
                            <SSOTypeField value={ssoType} />
                        </ColItem>
                    </FormSection>
                    {ssoType === 'msal' && <MSALConfiguration isNew={defaultSSOType !== ssoType} />}
                    {ssoType === 'oidc' && <OIDCConfiguration isNew={defaultSSOType !== ssoType} />}
                    {ssoType !== 'none' && <SSOBehaviorSection ssoType={ssoType} />}
                </FormLayout>
            </form>
        </FormProvider>
    );
};

export default SSOForm;
