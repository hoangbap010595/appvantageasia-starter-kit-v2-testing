import type { Transporter } from 'nodemailer';
import * as config from '../config.js';

const getTransporter = async (): Promise<Transporter> => {
    switch (config.transporter) {
        case 'SMTP':
            return import('./smtp.js').then(module => module.default);

        case 'SES':
            return import('./ses.js').then(module => module.default);

        default:
            throw new Error(`Unknown transporter: ${config.transporter}`);
    }
};

export default await getTransporter();
