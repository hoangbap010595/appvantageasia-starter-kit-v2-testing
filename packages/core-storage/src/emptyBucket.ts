import { ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import * as config from './config.js';
import getClient from './getClient.js';

const emptyBucket = async (bucket = config.bucket) => {
    const s3 = await getClient();

    let isTruncated = true;
    let continuationToken: string | undefined;

    // Delete all objects
    while (isTruncated) {
        const listCommand = new ListObjectsV2Command({
            Bucket: bucket,
            ContinuationToken: continuationToken,
        });

        const listData = await s3.send(listCommand);

        isTruncated = listData.IsTruncated || false;
        continuationToken = listData.NextContinuationToken;

        if (listData.Contents?.length) {
            const deleteCommand = new DeleteObjectsCommand({
                Bucket: bucket,
                Delete: { Objects: listData.Contents.map(({ Key }) => ({ Key })) },
            });

            await s3.send(deleteCommand);
        }
    }
};

export default emptyBucket;
