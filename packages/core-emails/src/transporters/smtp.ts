import { env } from '@appvantageasia/core-utils';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { getEnvKey } from '../config.js';

const { getString, getInteger, getBoolean } = env;

const config: SMTPTransport.Options = {
    host: getString(getEnvKey('SMTP_HOST'), 'localhost'),
    port: getInteger(getEnvKey('SMTP_PORT'), 465),
    secure: getBoolean(getEnvKey('SMTP_SECURE'), false),
};

const user = getString(getEnvKey('SMTP_USER'));

if (user) {
    config.auth = {
        user,
        pass: getString(getEnvKey('SMTP_PASSWORD'), ''),
    };
}

export default createTransport(config);
