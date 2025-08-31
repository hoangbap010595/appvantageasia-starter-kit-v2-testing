import { startTransition, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { InputValues } from './useFormSchema';
import type { SelectOption } from '@/components/common/Select';
import Select from '@/components/common/Select';

export interface SSOTypeFieldProps {
    value: 'msal' | 'oidc' | 'none';
}

const SSOTypeField = ({ value }: SSOTypeFieldProps) => {
    const { t } = useTranslation(['system']);
    const { control, setValue } = useFormContext();

    const onChange = useCallback(
        (newValue: any) => {
            const nextValues: InputValues = { msal: null, oidc: null };
            const defaultValues = control._defaultValues;

            if (newValue === 'msal') {
                nextValues.msal = {
                    authority: '',
                    clientId: '',
                    clientSecret: '',
                    enforced: false,
                    ...defaultValues.msal,
                };
            } else if (newValue === 'oidc') {
                nextValues.oidc = {
                    clientId: '',
                    clientSecret: '',
                    enforced: false,
                    endpoint: '',
                    ...defaultValues.oidc,
                };
            }

            startTransition(() => {
                setValue('msal', nextValues.msal);
                setValue('oidc', nextValues.oidc);
            });
        },
        [setValue, control]
    );

    const options = useMemo(
        (): SelectOption[] => [
            { value: 'none', label: t('system:sections.ssoImplementation.ssoTypes.none.label') },
            { value: 'msal', label: t('system:sections.ssoImplementation.ssoTypes.msal.label') },
            { value: 'oidc', label: t('system:sections.ssoImplementation.ssoTypes.oidc.label') },
        ],
        [t]
    );

    return (
        <Select
            {...t('system:sections.ssoImplementation.fields.protocol', { returnObjects: true })}
            helpElement={t(`system:sections.ssoImplementation.ssoTypes.${value}.description`)}
            name="protocol"
            onChange={onChange}
            options={options}
            value={value}
        />
    );
};

export default SSOTypeField;
