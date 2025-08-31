import type { HandleFunction } from '@appvantageasia/core-bull';
import { renderTwoFactorUpdate } from '@appvantageasia/core-emails';
import { Trail } from '@appvantageasia/core-trail';
import { getCollections, otpAuthentication } from '@appvantageasia/core-users';
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
        await renderTwoFactorUpdate({
            data: {
                enable: !!otpAuthentication.getProfile(user),
            },
            to: user.email,
            subject: 'Two-factor Authentication Updated',
        });
    } catch (error) {
        await new Trail()
            .error()
            .eventType('FAILED_SEND_TWO_FACTOR_UPDATE')
            .setSpec('context', { email: user.email, failure: error })
            .save();

        throw error;
    }
};

export default handler;
