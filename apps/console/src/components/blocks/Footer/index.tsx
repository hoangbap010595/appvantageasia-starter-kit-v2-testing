import { useTranslation } from 'react-i18next';
import runtime from '../../../runtime';

const Footer = () => {
    const { t } = useTranslation('common');
    const year = new Date().getFullYear();

    return (
        <footer className="p-2 text-center text-xs text-gray-500">
            {t('common:copyright', { year, version: runtime.appVersion })}
        </footer>
    );
};

export default Footer;
