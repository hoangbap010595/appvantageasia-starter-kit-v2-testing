import type { Document } from 'bson';
import type { QueueOptions } from 'bull';
import BullQueue from 'bull';
import { Redis } from 'ioredis';
import * as config from './config.js';
import { client, subscriber } from './redis.js';

const createClient: QueueOptions['createClient'] = type => {
    switch (type) {
        case 'client':
            return client;

        case 'subscriber':
            return subscriber;

        default:
            return new Redis(config.redisUri, { maxRetriesPerRequest: null, enableReadyCheck: false });
    }
};

const queue = new BullQueue<Document>(config.queueName, { createClient });

export default queue;
