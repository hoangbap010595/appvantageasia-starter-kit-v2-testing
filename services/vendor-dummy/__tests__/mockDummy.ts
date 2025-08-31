import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import urlJoin from 'url-join';
import { expect } from 'vitest';
import * as mocks from './mockData.js';

const server = setupServer(
    // mock authorization
    http.post(urlJoin(mocks.settings.endpoint, '/authorize'), async ({ request }) => {
        // validate the body
        const data = await request.json();

        expect(data).toEqual({
            grant_type: 'client_credentials',
            username: mocks.settings.username,
            password: mocks.settings.password,
        });

        return HttpResponse.json({
            access_token: mocks.authToken,
        });
    }),

    // mock get whatever
    http.get(urlJoin(mocks.settings.endpoint, 'whatever/:uid'), async ({ request, params }) => {
        // validate the authorization token
        const authorization = request.headers.get('authorization');
        expect(authorization).toBe(`Bearer ${mocks.authToken}`);

        // validate the body
        expect(params).toEqual(mocks.getWhateverParams);

        return HttpResponse.json({ done: 'GetWhatever' });
    })
);

server.events.on('unhandledException', ({ error }) => {
    console.error(error);
});

export default server;
