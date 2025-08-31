import { DeleteBucketCommand } from '@aws-sdk/client-s3';
import * as config from './config.js';
import emptyBucket from './emptyBucket.js';
import getClient from './getClient.js';

const deleteBucket = async (bucket = config.bucket) => {
    const s3 = await getClient();

    const command = new DeleteBucketCommand({ Bucket: bucket });

    try {
        await s3.send(command);
    } catch (error: any) {
        if (error.Code === 'BucketNotEmpty') {
            // first empty the bucket then retry the deletion
            await emptyBucket(bucket);
            await s3.send(command);

            return;
        }

        if (error.Code === 'NoSuchBucket') {
            // we can skip it
            return;
        }

        throw error;
    }
};

export default deleteBucket;
