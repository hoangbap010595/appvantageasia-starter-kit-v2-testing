import { extname, join } from 'node:path';
import type { Readable } from 'node:stream';
import { Upload } from '@aws-sdk/lib-storage';
import mime from 'mime-types';
import { ObjectId } from 'mongodb';
import { nanoid } from 'nanoid';
import type { UploadedFileDocument } from './UploadedFile.js';
import UploadedFile from './UploadedFile.js';
import * as config from './config.js';
import getClient from './getClient.js';

const uploadFile = async (
    stream: Readable,
    prefix: string,
    filename: string,
    mimetype: string,
    encoding: string,
    bucket = config.bucket
): Promise<UploadedFile> => {
    const key = join(prefix, `${nanoid(10)}${extname(filename)}`);
    const s3 = await getClient();
    const id = new ObjectId();

    const upload = new Upload({
        client: s3,
        params: {
            Bucket: bucket,
            Key: key,
            Metadata: { filename, oid: id.toHexString() },
            ContentType: mimetype || (mime.lookup(filename) as string),
            ContentEncoding: encoding,
            Body: stream,
        },
    });

    await upload.done();

    const document: UploadedFileDocument = { _id: id, objectKey: key, filename, mimetype, encoding };

    return new UploadedFile(document);
};

export default uploadFile;
