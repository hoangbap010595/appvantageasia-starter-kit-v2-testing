import defaultMailpit from './default.js';
import type { MessageFilter, MessageResponse } from './types.js';

const findEmail = async (filter: MessageFilter = {}, mailpit = defaultMailpit): Promise<MessageResponse | null> => {
    const { messages } = await mailpit.listMessages();

    const messageId = messages.find(item => {
        if (filter.toAddress && !item.To.some(recipient => recipient.Address === filter.toAddress)) {
            return false;
        }

        if (filter.subject && item.Subject !== filter.subject) {
            return false;
        }

        return true;
    })?.ID;

    if (!messageId) {
        return null;
    }

    return mailpit.getMessage(messageId);
};

export default findEmail;
