import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import Button from '@/components/common/Button';

export interface NotFoundProps {
    homePath?: string | null;
    centered?: boolean;
}

const NotFound = ({ homePath = '/', centered = false }: NotFoundProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation('common');

    const element = (
        <div className="text-center">
            <p className="text-base font-semibold text-pink-400">404</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-5xl">
                {t('common:pages:404:title')}
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-500">{t('common:pages:404:description')}</p>
            {homePath && (
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button color="primary" onClick={() => navigate(homePath)}>
                        {t('common:pages:404:buttonSpan')}
                    </Button>
                </div>
            )}
        </div>
    );

    if (!centered) {
        return element;
    }

    return <div className="flex h-screen items-center justify-center p-3">{element}</div>;
};

export default NotFound;
