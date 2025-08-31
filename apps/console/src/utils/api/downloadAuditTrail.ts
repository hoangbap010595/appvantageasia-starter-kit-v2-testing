import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { getToken } from '../session';

const downloadAuditTrail = async (range: { start: Date; end: Date }) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch('/api/trails/download', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            start: dayjs(range.start).format('YYYY-MM-DD'),
            end: dayjs(range.end).format('YYYY-MM-DD'),
        }),
    });

    const blob = await response.blob();
    const start = dayjs(range.start).format('YYYYMMDD');
    const end = dayjs(range.end).format('YYYYMMDD');

    return saveAs(blob, `audit-trail-${start}-${end}.json`);
};

export default downloadAuditTrail;
