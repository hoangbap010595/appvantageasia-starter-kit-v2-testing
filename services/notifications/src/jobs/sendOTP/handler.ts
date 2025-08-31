import type { HandleFunction } from '@appvantageasia/core-bull';
import { renderOtp } from '@appvantageasia/core-emails';
import { Trail } from '@appvantageasia/core-trail';

export interface JobPayload {
    email: string;
    otp: { code: string; leftTime: number };
}

const handler: HandleFunction<JobPayload> = async ({ email, otp }) => {
    try {
        await renderOtp({
            data: { otp },
            to: email,
            subject: 'Otp',
        });
    } catch (error) {
        await new Trail()
            .error()
            .eventType('FAILED_SEND_OTP_FOR_UPDATING_EMAIL')
            .setSpec('context', { email, failure: error })
            .save();

        throw error;
    }
};

export default handler;
