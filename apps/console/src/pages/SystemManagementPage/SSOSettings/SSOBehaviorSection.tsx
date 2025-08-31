import { useTranslation } from 'react-i18next';
import FormSection, { ColItem } from '@/components/blocks/FormSection';
import SwitchField from '@/components/fields/SwitchField';

export interface SSOBehaviorSectionProps {
    ssoType: 'msal' | 'oidc';
}

const SSOBehaviorSection = ({ ssoType }: SSOBehaviorSectionProps) => {
    const { t } = useTranslation(['system']);

    return (
        <FormSection title={t('system:sections.ssoBehavior.title')}>
            <ColItem className="sm:col-span-full">
                <SwitchField
                    {...t('system:sections.ssoBehavior.fields.enforced', { returnObjects: true })}
                    name={`${ssoType}.enforced`}
                />
            </ColItem>
        </FormSection>
    );
};

export default SSOBehaviorSection;
