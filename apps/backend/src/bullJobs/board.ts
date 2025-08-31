import { queue } from '@appvantageasia/core-bull';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter.js';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();

export const bullBoard = createBullBoard({
    queues: [new BullAdapter(queue)],
    serverAdapter,
});

export default serverAdapter;
