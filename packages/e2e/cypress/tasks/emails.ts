import type { MessageFilter } from '@appvantageasia/e2e-emails';
import { findEmail, defaultMailpit } from '@appvantageasia/e2e-emails';

export const get = async (filter: MessageFilter = {}) => {
    for (let tries = 0; tries < 20; tries++) {
        const email = await findEmail(filter);

        if (email) {
            return email;
        }

        await new Promise<any>(resolve => {
            setTimeout(resolve, 500);
        });
    }

    throw new Error('Could not retrieve email');
};

export const empty = () => defaultMailpit.deleteAll();
