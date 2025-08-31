import { Redis } from 'ioredis';
import * as config from './config.js';

export const client = new Redis(config.redisUri, { enableReadyCheck: false });

export const subscriber = new Redis(config.redisUri, { maxRetriesPerRequest: null, enableReadyCheck: false });
