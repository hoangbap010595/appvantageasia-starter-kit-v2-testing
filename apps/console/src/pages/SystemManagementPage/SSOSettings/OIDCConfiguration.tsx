import { useTranslation } from 'react-i18next';
import FormSection, { ColItem } from '@/components/blocks/FormSection';
import CopyInput from '@/components/common/CopyInput';
import InputField from '@/components/fields/InputField';
import PasswordField from '@/components/fields/PasswordField';
import runtime from '@/runtime';

export interface OIDCConfigurationProps {
    isNew: boolean;
}

const OIDCConfiguration = ({ isNew }: OIDCConfigurationProps) => {
    const { t } = useTranslation(['system']);

    return (
        <FormSection title={t('system:sections.ssoConfiguration.title')}>
            <ColItem className="sm:col-span-full">
                <InputField
                    {...t('system:sections.ssoConfiguration.oidcFields.endpoint', { returnObjects: true })}
                    name="oidc.endpoint"
                    placeholder="https://oidc.issuer.co"
                    required
                />
            </ColItem>
            <ColItem className="sm:col-span-full">
                <InputField
                    {...t('system:sections.ssoConfiguration.oidcFields.clientId', { returnObjects: true })}
                    name="oidc.clientId"
                    required
                />
            </ColItem>
            <ColItem className="sm:col-span-full">
                <PasswordField
                    {...t('system:sections.ssoConfiguration.oidcFields.clientSecret', { returnObjects: true })}
                    name="oidc.clientSecret"
                    required={isNew}
                />
            </ColItem>
            <ColItem className="sm:col-span-full">
                <CopyInput
                    {...t('system:sections.ssoConfiguration.callback', { returnObjects: true })}
                    value={`https://${runtime.hostname}/login/sso/oidc`}
                    name="msal.callback"
                />
            </ColItem>
        </FormSection>
    );
};

export default OIDCConfiguration;
