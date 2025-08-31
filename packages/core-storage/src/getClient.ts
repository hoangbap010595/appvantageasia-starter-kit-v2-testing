import getAwsCredentials from '@appvantageasia/core-aws-credentials';
import { S3Client } from '@aws-sdk/client-s3';
import { getApplyMd5BodyChecksumPlugin } from '@aws-sdk/middleware-apply-body-checksum';
import type { AwsCredentialIdentityProvider } from '@smithy/types';
import * as config from './config.js';

const getClient = async () => {
    const credentials: AwsCredentialIdentityProvider = config.useAwsCredentials
        ? await getAwsCredentials()
        : async () => ({
              accessKeyId: config.accessKey!,
              secretAccessKey: config.secretKey!,
          });

    const client = new S3Client({
        region: config.region,
        credentials,
        endpoint: config.endpoint,
        forcePathStyle: config.forcePathStyle, // required to be true when using MinIO servers
    });

    const md5ChecksumPlugin = getApplyMd5BodyChecksumPlugin(client.config);
    // @ts-expect-error Argument of type Pluggable<any, any> is not assignable to parameter of type
    client.middlewareStack.use(md5ChecksumPlugin);

    return client;
};

export default getClient;
