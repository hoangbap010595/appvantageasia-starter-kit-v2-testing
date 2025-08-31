import { UploadedFile } from '@appvantageasia/core-storage';
import type { GqlUploadedFileResolvers } from '../resolver-types.js';

const resolver: GqlUploadedFileResolvers = {
    id: root => root._id,
    url: root => new UploadedFile(root).getPresignedLink(),
};

export default resolver;
