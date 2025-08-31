import { config } from '@appvantageasia/core-redis';
import { EJSON } from 'bson';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';
import { nanoid } from 'nanoid';

export const publisher = new Redis(config.redisUri);

export const subscriber = new Redis(config.redisUri);

export const pubSub = new RedisPubSub({
    publisher,
    subscriber,
    serializer: source => JSON.stringify(source),
    deserializer: source => EJSON.parse(source.toString('utf-8')),
});

export const createSocketChannel = () => {
    const id = nanoid();
    const channel = `pubSub.socket.${id}`;

    return { channel, id };
};

export type SocketChannel = ReturnType<typeof createSocketChannel>;

export const getAsyncIterator = (channel: string | string[], pattern = true) =>
    pubSub.asyncIterator(channel, { pattern }) as unknown as AsyncIterable<any>;
