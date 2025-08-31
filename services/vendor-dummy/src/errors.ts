import type { Response, Request } from 'node-fetch';

export interface ErrorContext {
    status: number;
    body: string;
}

export class APIError extends Error {
    public context?: ErrorContext;
}

export const throwErrorFromResponse = async (request: Request, response: Response): Promise<never> => {
    let body = await response.text();

    try {
        // try to parse it as JSON
        body = JSON.parse(body);
    } catch {
        // can't be parsed as JSON so we just skip it
    }

    const error = new APIError(`Failed to invoke ${request.method} ${request.url}`);
    error.context = { status: response.status, body };

    throw error;
};
