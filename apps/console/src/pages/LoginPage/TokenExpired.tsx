import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { ActionHandlers } from './useStep';
import LoginPortalLayout from '@/components/blocks/LoginPortalLayout';
import Button from '@/components/common/Button';

interface TokenExpiredProps {
    actions: ActionHandlers;
}

const TokenExpired = ({ actions }: TokenExpiredProps) => {
    const { t } = useTranslation('loginPage');
    const onLinkClick = useCallback(() => {
        actions.goBackToAuthenticate();
    }, [actions]);

    return (
        <LoginPortalLayout title={t('loginPage:signInExpiredToken.title')}>
            <div>
                <div className="mb-5 text-center text-sm break-words text-black">
                    {t('loginPage:signInExpiredToken.description')}
                </div>
                <Button className="w-full" color="primary" onClick={onLinkClick}>
                    {t('loginPage:signInExpiredToken.authenticateLink')}
                </Button>
            </div>
        </LoginPortalLayout>
    );
};

export default TokenExpired;
