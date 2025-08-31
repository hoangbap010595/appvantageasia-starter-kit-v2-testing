import getCredentials from '@appvantageasia/core-aws-credentials';
import { env } from '@appvantageasia/core-utils';
import * as aws from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer';
import { getEnvKey } from '../config.js';

const { getString, getNumber } = env;

const ses = new aws.SES({
    apiVersion: getString(getEnvKey('SES_API_VERSION'), '2010-12-01'),
    region: getString(getEnvKey('SES_REGION'), 'us-east-1'),
    credentials: await getCredentials(),
});

export default createTransport({
    SES: { aws, ses },
    sendingRate: getNumber(getEnvKey('SES_SENDING_RATE')),
});
