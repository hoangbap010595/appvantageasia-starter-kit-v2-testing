import { useTranslation } from 'react-i18next';
import FormSection, { ColItem } from '@/components/blocks/FormSection';
import CopyInput from '@/components/common/CopyInput';
import InputField from '@/components/fields/InputField';
import PasswordField from '@/components/fields/PasswordField';
import runtime from '@/runtime';

export interface MSALConfigurationProps {
    isNew: boolean;
}

const MSALConfiguration = ({ isNew }: MSALConfigurationProps) => {
    const { t } = useTranslation(['system']);

    return (
        <FormSection title={t('system:sections.ssoConfiguration.title')}>
            <ColItem className="sm:col-span-full">
                <InputField
                    {...t('system:sections.ssoConfiguration.msalFields.authority', { returnObjects: true })}
                    name="msal.authority"
                    placeholder="https://login.microsoftonline.com/tenant-id"
                    required
                />
            </ColItem>
            <ColItem className="sm:col-span-full">
                <InputField
                    {...t('system:sections.ssoConfiguration.msalFields.clientId', { returnObjects: true })}
                    name="msal.clientId"
                    required
                />
            </ColItem>
            <ColItem className="sm:col-span-full">
                <PasswordField
                    {...t('system:sections.ssoConfiguration.msalFields.clientSecret', { returnObjects: true })}
                    name="msal.clientSecret"
                    required={isNew}
                />
            </ColItem>
            <ColItem className="sm:col-span-full">
                <CopyInput
                    {...t('system:sections.ssoConfiguration.callback', { returnObjects: true })}
                    value={`https://${runtime.hostname}/login/sso/msal`}
                    name="msal.callback"
                />
            </ColItem>
        </FormSection>
    );
};

export default MSALConfiguration;
