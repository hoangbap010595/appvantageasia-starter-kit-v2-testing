import type { HandleFunction } from '@appvantageasia/core-bull';
import { renderResetPassword } from '@appvantageasia/core-emails';
import { Trail } from '@appvantageasia/core-trail';
import { getCollections } from '@appvantageasia/core-users';
import type { ObjectId } from 'mongodb';
import urlJoin from 'url-join';
import { protocol, hostname } from '../../config.js';

export interface JobPayload {
    userId: ObjectId;
    token: string;
}

const handler: HandleFunction<JobPayload> = async ({ userId, token }) => {
    const { users } = await getCollections();
    const user = await users.findOne({ _id: userId });

    if (!user) {
        throw new Error('user not found ');
    }

    const url = urlJoin(`${protocol}://${hostname}`, '/login/resetPassword', `?token=${token}`);

    try {
        await renderResetPassword({
            data: { user, url },
            to: user.email,
            subject: 'Reset Password',
        });
    } catch (error) {
        await new Trail()
            .error()
            .eventType('FAILED_SEND_RESET_PASSWORD_EMAIL')
            .setSpec('context', { email: user.email, failure: error })
            .save();

        throw error;
    }
};

export default handler;
