import fetch from 'node-fetch';
import join from 'url-join';
import type { MessageResponse, MessagesResponse } from './types.js';

class Mailpit {
    private endpoint: string;

    constructor(hostname: string, port: number) {
        this.endpoint = `http://${hostname}:${port}/api/v1/`;
    }

    public async getMessage(messageId: string): Promise<MessageResponse> {
        const response = await fetch(join(this.endpoint, `/message/${messageId}`));

        if (!response.ok) {
            throw new Error(`Failed to get message: ${response.statusText}`);
        }

        const data = await response.json();

        return data as MessageResponse;
    }

    public async listMessages(limit = 10): Promise<MessagesResponse> {
        const response = await fetch(join(this.endpoint, `/messages?limit=${limit}`));

        if (!response.ok) {
            throw new Error(`Failed to list messages: ${response.statusText}`);
        }

        const data = await response.json();

        return data as MessagesResponse;
    }

    public async deleteAll(): Promise<boolean> {
        const response = await fetch(join(this.endpoint, '/messages'), { method: 'DELETE' });

        if (!response.ok) {
            throw new Error(`Failed to delete messages: ${response.statusText}`);
        }

        const text = await response.text();

        return text === 'ok';
    }
}

export default Mailpit;
