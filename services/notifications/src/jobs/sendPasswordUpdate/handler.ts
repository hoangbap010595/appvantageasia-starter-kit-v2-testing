import type { HandleFunction } from '@appvantageasia/core-bull';
import { renderPasswordUpdate } from '@appvantageasia/core-emails';
import { Trail } from '@appvantageasia/core-trail';
import { getCollections } from '@appvantageasia/core-users';
import type { ObjectId } from 'mongodb';

export interface JobPayload {
    userId: ObjectId;
}

const handler: HandleFunction<JobPayload> = async ({ userId }) => {
    const { users } = await getCollections();
    const user = await users.findOne({ _id: userId });

    if (!user) {
        throw new Error('User not found');
    }

    try {
        await renderPasswordUpdate({
            data: {},

            to: user.email,
            subject: 'Password Updated',
        });
    } catch (error) {
        await new Trail()
            .error()
            .eventType('FAILED_SEND_PASSWORD_UPDATE')
            .setSpec('context', { email: user.email, failure: error })
            .save();

        throw error;
    }
};

export default handler;
