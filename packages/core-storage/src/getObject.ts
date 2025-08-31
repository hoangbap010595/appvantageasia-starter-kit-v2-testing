import { GetObjectCommand } from '@aws-sdk/client-s3';
import * as config from './config.js';
import getClient from './getClient.js';

const getObject = async (objectKey: string, bucket = config.bucket) => {
    const s3 = await getClient();
    const command = new GetObjectCommand({ Bucket: bucket, Key: objectKey });

    return s3.send(command);
};

export default getObject;
