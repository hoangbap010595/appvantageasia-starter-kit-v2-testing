import { CreateBucketCommand, BucketAlreadyOwnedByYou } from '@aws-sdk/client-s3';
import * as config from './config.js';
import getClient from './getClient.js';

const createBucket = async (bucket = config.bucket) => {
    const s3 = await getClient();

    const command = new CreateBucketCommand({ Bucket: bucket });

    try {
        await s3.send(command);
    } catch (error) {
        if (error instanceof BucketAlreadyOwnedByYou) {
            // the bucket is already there, we can skip it
            return;
        }

        throw error;
    }
};

export default createBucket;
