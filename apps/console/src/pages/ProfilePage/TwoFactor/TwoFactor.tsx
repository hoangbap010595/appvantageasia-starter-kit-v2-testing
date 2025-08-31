import { useTranslation } from 'react-i18next';
import type { ProfileDataFragment } from '../FetchProfile.api';
import AuthenticatorSetup from './AuthenticatorSetup';
import AuthenticatorSummary from './AuthenticatorSummary';
import FormSection from '@/components/blocks/FormSection';
import FormLayout from '@/components/layouts/FormLayout';

export interface TwoFactorProps {
    profile: ProfileDataFragment;
    refetch: () => unknown;
}

const TwoFactor = ({ profile, refetch }: TwoFactorProps) => {
    const { t } = useTranslation('profile');

    return (
        <FormLayout>
            <FormSection description={t('profile:sections.2fa.description')} title={t('profile:sections.2fa.title')}>
                {profile.otpAuthenticator ? (
                    <AuthenticatorSummary profile={profile} refetch={refetch} />
                ) : (
                    <AuthenticatorSetup profile={profile} refetch={refetch} />
                )}
            </FormSection>
        </FormLayout>
    );
};

export default TwoFactor;
