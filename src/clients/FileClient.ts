import { callbackify } from 'util';

import BaseClient, { ClientMethodCallback } from './BaseClient';
import { FileMetadata } from '../entities';
import { createWriteStream } from 'fs';
import { Stream } from 'stream';

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

    /**
     * Downloads a file from Catalytic
     *
     * @param id The ID of the file to download
     * @param path The path to which the file should be downloaded
     */
    download(id: string, path: string): Promise<void>;
    /**
     * Downloads a file from Catalytic
     *
     * @param id The ID of the file to download
     * @param path The path to which the file should be downloaded
     * @param callback The callback
     */
    download(id: string, path: string, callback: ClientMethodCallback<void>): void;
    /**
     * Downloads a file from Catalytic
     *
     * @param id The ID of the file to download
     * @param path The path to which the file should be downloaded
     * @param callback The optional callback
     */
    download(id: string, path: string, callback?: ClientMethodCallback<void>): Promise<void> {
        if (callback) {
            return callbackify(this._download).call(this, id, path, callback);
        }

        return this._download(id, path.toString());
    }

    private async _download(id: string, path: string): Promise<void> {
        // Calls protected BaseClient method
        return this.downloadFile(id, path);
    }

    /**
     * Gets a download stream for a file from Catalytic
     *
     * @param id The ID of the file to download
     */
    getDownloadStream(id: string): Promise<Stream>;
    /**
     * Gets a download stream for a file from Catalytic
     *
     * @param id The ID of the file to download
     * @param callback The callback
     */
    getDownloadStream(id: string, callback: ClientMethodCallback<Stream>): void;
    /**
     * Gets a download stream for a file from Catalytic
     *
     * @param id The ID of the file to download
     * @param callback The optional callback
     */
    getDownloadStream(id: string, callback?: ClientMethodCallback<Stream>): Promise<Stream> {
        console.log(`Getting download stream for file ${id}`);
        if (callback) {
            return callbackify(this._getDownloadStream).call(this, id, callback);
        }

        return this._getDownloadStream(id);
    }

    private async _getDownloadStream(id: string): Promise<Stream> {
        // calls protected BaseClient method
        return this.getFileDownloadStream(id);
    }
}
