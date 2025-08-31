import { getBroker } from '@appvantageasia/core-broker';
import { closeConnections } from '@appvantageasia/core-database';
import { upsetSystemConfig } from '@appvantageasia/core-system';
import loadSnapshots from '@appvantageasia/e2e-snapshots';
import { describe, test, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import { getInterface, createServices, type Settings } from '../src/index.js';
import * as mock from './mockData.js';

beforeAll(async () => {
    const broker = await getBroker();
    await createServices(broker);
    await broker.start();
});

afterAll(async () => {
    const broker = await getBroker();
    await broker.stop();
    await closeConnections(true);
});

beforeEach(async () => {
    await loadSnapshots('baseUsers');
    await upsetSystemConfig<Settings>('vendor_dummy', mock.settings);
});

describe('Dummy Broker', () => {
    test('Get Whatever', async () => {
        const broker = await getBroker();
        const { getWhatever } = getInterface(broker);
        const response = await getWhatever({ uid: 'Z2L1' });
        expect(response).toEqual({ done: 'GetWhatever' });
    });
});
