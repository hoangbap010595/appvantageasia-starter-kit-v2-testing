import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as config from './config.js';
import getClient from './getClient.js';

const generatePresignedUrl = async (objectKey: string, expiresIn = 3600, bucket = config.bucket) => {
    const client = await getClient();
    const command = new GetObjectCommand({ Bucket: bucket, Key: objectKey });

    return getSignedUrl(client, command, { expiresIn });
};

export default generatePresignedUrl;
