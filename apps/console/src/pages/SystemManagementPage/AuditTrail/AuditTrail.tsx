import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import Space from '@/components/common/Space';
import downloadAuditTrail from '@/utils/api/downloadAuditTrail';

const AuditTrail = () => {
    const { t } = useTranslation(['system']);

    const download = useCallback(() => {
        const start = dayjs().subtract(30, 'day').toDate();
        const end = new Date();
        downloadAuditTrail({ start, end });
    }, []);

    return (
        <Space direction="vertical">
            <Alert type="notice" description={t('system:sections.auditTrail.notice')} />
            <Button onClick={download}>{t('system:sections.auditTrail.downloadButton')}</Button>
        </Space>
    );
};

export default AuditTrail;
