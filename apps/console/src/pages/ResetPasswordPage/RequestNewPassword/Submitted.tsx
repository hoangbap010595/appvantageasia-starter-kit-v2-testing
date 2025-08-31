import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';

const Submitted = () => {
    const { t } = useTranslation('loginPage');
    const navigate = useNavigate();

    return (
        <div>
            <div className="mb-5 text-center">
                <Alert text={t('loginPage:requestNewPassword.successMessage')} type="success" />
            </div>
            <Button
                className="w-full pt-2 pb-2"
                color="primary"
                onClick={() => {
                    navigate('..');
                }}
            >
                {t('loginPage:requestNewPassword.authenticateLink')}
            </Button>
        </div>
    );
};

export default Submitted;
