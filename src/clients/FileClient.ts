import { callbackify } from 'util';

import BaseClient, { ClientMethodCallback } from './BaseClient';
import { FileMetadata } from '../entities';

export default class FileClient extends BaseClient {
    static entity = 'File';

    /**
     * Gets a File's Metadata by ID
     *
     * @param id The ID of the File
     * @returns The Metadata of the File with the provided ID
     */
    get(id: string): Promise<FileMetadata>;
    /**
     * Gets a File's Metadata by ID
     *
     * @param id The ID of the File
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<FileMetadata>): void;
    /**
     * Gets a File's Metadata by ID
     *
     * @param id The ID of the File
     * @param callback The optional callback
     * @returns The Metadata of the File with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<FileMetadata>): Promise<FileMetadata> {
        if (callback) {
            return callbackify(this._get).call(this, id, callback);
        }

        return this._get(id);
    }

    private async _get(id: string): Promise<FileMetadata> {
        console.log(`Getting FileMetadata for File with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getFile(id, { customHeaders: headers });
        return this.parseResponse<FileMetadata>(result);
    }

    /**
     * Uploads a file to Catalytic
     *
     * @param filePath The path of the file on disk
     * @returns The Metadata of the uploaded File
     */
    upload(filePath: string): Promise<FileMetadata>;
    /**
     * Uploads a file to Catalytic
     *
     * @param filePath The path of the file on disk
     * @param callback The callback
     */
    upload(filePath: string, callback: ClientMethodCallback<FileMetadata>): void;
    /**
     * Uploads a file to Catalytic
     *
     * @param filePath The path of the file on disk
     * @param callback The optional callback
     * @returns The Metadata of the uploaded File
     */
    upload(filePath: string, callback?: ClientMethodCallback<FileMetadata>): Promise<FileMetadata> {
        if (callback) {
            return callbackify(this._upload).call(this, filePath, callback);
        }

        return this._upload(filePath);
    }

    private async _upload(filePath: string): Promise<FileMetadata> {
        // Calls protected BaseClient.uploadFile method
        return this.uploadFile(filePath);
    }
}
