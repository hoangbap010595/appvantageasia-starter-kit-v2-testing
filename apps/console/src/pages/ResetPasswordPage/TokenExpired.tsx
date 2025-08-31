import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import LoginPortalLayout from '@/components/blocks/LoginPortalLayout';
import Button from '@/components/common/Button';

const TokenExpired = () => {
    const { t } = useTranslation('loginPage');
    const navigate = useNavigate();
    const onLinkClick = useCallback(() => {
        navigate('..', { replace: true });
    }, [navigate]);

    return (
        <LoginPortalLayout title={t('loginPage:forgotPasswordExpiredToken.title')}>
            <div>
                <div className="mb-5 text-center text-sm break-words text-black">
                    {t('loginPage:forgotPasswordExpiredToken.description')}
                </div>
                <Button className="w-full" color="primary" onClick={onLinkClick}>
                    {t('loginPage:forgotPasswordExpiredToken.authenticateLink')}
                </Button>
            </div>
        </LoginPortalLayout>
    );
};

export default TokenExpired;
