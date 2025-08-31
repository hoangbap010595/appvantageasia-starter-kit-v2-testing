import { describe, test, expect } from 'vitest';
import API from '../src/API.js';
import * as mock from './mockData.js';

describe('Dummy API', () => {
    test('Authentication', async () => {
        const api = new API(mock.settings);
        const authorization = await api.getAuthorization();
        expect(authorization).toBe(mock.authToken);
    });

    test('Get Whatever', async () => {
        const api = new API(mock.settings);
        const response = await api.getWhatever(mock.getWhateverParams);
        expect(response).toEqual({ done: 'GetWhatever' });
    });
});
