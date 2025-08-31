import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as config from './config.js';
import getClient from './getClient.js';

const deleteObject = async (objectKey: string, bucket = config.bucket) => {
    const s3 = await getClient();
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: objectKey });

    await s3.send(command);
};

export default deleteObject;
