import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useDateFormats = () => {
    const { t } = useTranslation('common');

    return useMemo(
        () => ({
            formatDateTime: (date: string | Date | Dayjs) => dayjs(date).format(t('common:formats.dateTime')),
            formatDate: (date: string | Date | Dayjs) => dayjs(date).format(t('common:formats.date')),
            formatDateYear: (date: string | Date | Dayjs) => dayjs(date).format(t('common:formats.dateYear')),
        }),
        [t]
    );
};

export default useDateFormats;
