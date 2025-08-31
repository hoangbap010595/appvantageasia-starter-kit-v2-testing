import type { RequestInit } from 'node-fetch';
import fetch, { Request } from 'node-fetch';
import urlJoin from 'url-join';
import { throwErrorFromResponse } from './errors.js';
import type { Settings } from './getSettings.js';
import type { GetWhateverParams, GetWhateverResponse } from './types.js';

class API {
    private readonly settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;
    }

    private async invoke<T = any>(endpoint: string, options: RequestInit) {
        const request = new Request(endpoint, options);
        const response = await fetch(request);

        if (response.status !== 200) {
            return throwErrorFromResponse(request, response);
        }

        return response.json() as Promise<T>;
    }

    public async getAuthorization() {
        const headers = { 'Content-Type': 'application/json' };

        const body = JSON.stringify({
            grant_type: 'client_credentials',
            username: this.settings.username,
            password: this.settings.password,
        });

        const endpoint = this.getEndpoint('/authorize');
        const response = await this.invoke(endpoint, { headers, body, method: 'POST' });

        return response.access_token as string;
    }

    public getEndpoint(path: string) {
        return urlJoin(this.settings.endpoint, path);
    }

    private async getHeaders() {
        const authorization = await this.getAuthorization();

        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authorization}`,
            Accept: 'application/json',
        };
    }

    public async getWhatever(params: GetWhateverParams) {
        const endpoint = this.getEndpoint(`/whatever/${params.uid}`);
        const headers = await this.getHeaders();

        return this.invoke<GetWhateverResponse>(endpoint, { headers, method: 'GET' });
    }
}

export default API;
