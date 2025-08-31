import type { FileUpload } from 'graphql-upload/processRequest.mjs';
import uploadFile from './uploadFile.js';

const uploadFileFromGraphQL = async (upload: FileUpload, prefix: string) =>
    uploadFile(upload.createReadStream(), prefix, upload.filename, upload.mimetype, upload.encoding);

export default uploadFileFromGraphQL;
