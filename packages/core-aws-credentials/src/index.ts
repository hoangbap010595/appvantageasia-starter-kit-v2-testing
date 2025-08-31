import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import type { AwsCredentialIdentityProvider } from '@smithy/types';
import * as config from './config.js';

const getCredentials = async (): Promise<AwsCredentialIdentityProvider> => {
    if (config.isCustomized) {
        // using custom environment variables
        return async () => ({
            accessKeyId: config.key!,
            secretAccessKey: config.secret!,
        });
    }

    // default credential chain
    return fromNodeProviderChain();
};

export default getCredentials;
