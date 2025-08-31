import { useApolloClient } from '@apollo/client';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons/faMicrosoft';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import goToMSAL from './goToMSAL';
import Button from '@/components/common/Button';

export interface MicrosoftButtonProps {
    disabled?: boolean;
}

const MicrosoftButton = ({ disabled }: MicrosoftButtonProps) => {
    const { t } = useTranslation('loginPage');
    const [isRetrievingLink, setIsRetrievingLink] = useState(false);
    const apolloClient = useApolloClient();

    const onClick = useCallback(async () => {
        setIsRetrievingLink(true);
        await goToMSAL(apolloClient);
    }, [setIsRetrievingLink, apolloClient]);

    return (
        <Button className="w-full" disabled={disabled || isRetrievingLink} onClick={onClick} type="button">
            <FontAwesomeIcon icon={faMicrosoft} /> {t('loginPage:authenticateStep.microsoftButton')}
        </Button>
    );
};

export default MicrosoftButton;
