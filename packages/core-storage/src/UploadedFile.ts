import type { ObjectId } from 'mongodb';
import deleteObject from './deleteObject.js';
import getObject from './getObject.js';
import getPresignedLink from './getPresignedLink.js';

export interface UploadedFileDocument {
    _id: ObjectId;
    objectKey: string;
    filename: string;
    mimetype: string;
    encoding: string;
}

class UploadedFile<Document extends UploadedFileDocument = UploadedFileDocument> {
    protected document: Document;

    constructor(document: Document) {
        this.document = document;
    }

    public toDocument() {
        return this.document;
    }

    public getObject() {
        return getObject(this.document.objectKey);
    }

    public getPresignedLink(expiresIn = 3600) {
        return getPresignedLink(this.document.objectKey, expiresIn);
    }

    public delete() {
        return deleteObject(this.document.objectKey);
    }
}

export default UploadedFile;
