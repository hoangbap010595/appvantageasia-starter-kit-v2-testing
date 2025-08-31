import { useApolloClient } from '@apollo/client';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import goToOIDC from './goToOIDC';
import Button from '@/components/common/Button';

export interface OIDCButtonProps {
    disabled?: boolean;
}

const OIDCButton = ({ disabled }: OIDCButtonProps) => {
    const { t } = useTranslation('loginPage');
    const [isRetrievingLink, setIsRetrievingLink] = useState(false);
    const apolloClient = useApolloClient();

    const onClick = useCallback(async () => {
        setIsRetrievingLink(true);
        await goToOIDC(apolloClient);
    }, [setIsRetrievingLink, apolloClient]);

    return (
        <Button className="w-full" disabled={disabled || isRetrievingLink} onClick={onClick} type="button">
            {t('loginPage:authenticateStep.oidcButton')}
        </Button>
    );
};

export default OIDCButton;
