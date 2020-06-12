import { Stream } from 'stream';

import BaseClient, { ClientMethodCallback } from './BaseClient';
import { FileMetadata, FileMetadataPage } from '../entities';
import { InternalError } from '../errors';

export default class FileClient extends BaseClient {
    static entity = 'File';

    /**
     * @summary Gets a File's Metadata by ID
     *
     * @param id The ID of the File
     * @returns The Metadata of the File with the provided ID
     */
    get(id: string): Promise<FileMetadata>;
    /**
     * @summary Gets a File's Metadata by ID
     *
     * @param id The ID of the File
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<FileMetadata>): void;
    /**
     * @summary Gets a File's Metadata by ID
     *
     * @param id The ID of the File
     * @param callback The optional callback
     * @returns The Metadata of the File with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<FileMetadata>): Promise<FileMetadata> | void {
        if (callback) {
            return this.callbackifyBound(this._get)(id, callback);
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
     * @summary Uploads a file to Catalytic
     *
     * @param filePath The path of the file on disk
     * @returns The Metadata of the uploaded File
     */
    upload(filePath: string): Promise<FileMetadata>;
    /**
     * @summary Uploads a file to Catalytic
     *
     * @param filePath The path of the file on disk
     * @param callback The callback
     */
    upload(filePath: string, callback: ClientMethodCallback<FileMetadata>): void;
    /**
     * @summary Uploads a file to Catalytic
     *
     * @param filePath The path of the file on disk
     * @param callback The optional callback
     * @returns The Metadata of the uploaded File
     */
    upload(filePath: string, callback?: ClientMethodCallback<FileMetadata>): Promise<FileMetadata> | void {
        if (callback) {
            return this.callbackifyBound(this._upload)(filePath, callback);
        }

        return this._upload(filePath);
    }

    private async _upload(filePath: string): Promise<FileMetadata> {
        // Calls protected BaseClient.uploadFile method
        const files = await this.uploadFile<FileMetadataPage>(filePath);
        const result = files.files[0];
        if (!result) {
            throw new InternalError('Failed to upload file');
        }
        return files.files[0];
    }

    /**
     * @summary Downloads a File from Catalytic
     *
     * @param id The ID of the File to download
     * @param path The path to which the file should be downloaded
     */
    download(id: string, path: string): Promise<void>;
    /**
     * @summary Downloads a File from Catalytic
     *
     * @param id The ID of the File to download
     * @param path The path to which the file should be downloaded
     * @param callback The callback
     */
    download(id: string, path: string, callback: ClientMethodCallback<void>): void;
    /**
     * @summary Downloads a File from Catalytic
     *
     * @param id The ID of the File to download
     * @param path The path to which the file should be downloaded
     * @param callback The optional callback
     */
    download(id: string, path: string, callback?: ClientMethodCallback<void>): Promise<void> | void {
        console.log(`Downloading File '${id}' to '${path}'`);
        if (callback) {
            return this.callbackifyBound(this._download)(id, path, callback);
        }

        return this._download(id, path.toString());
    }

    private _download(id: string, path: string): Promise<void> {
        // Calls protected BaseClient method
        const endpoint = this._getDownloadEndpoint(id);
        return this.downloadFile(endpoint, path);
    }

    /**
     * @summary Gets a download stream for a File from Catalytic
     *
     * @param id The ID of the File to download
     */
    getDownloadStream(id: string): Promise<Stream>;
    /**
     * @summary Gets a download stream for a File from Catalytic
     *
     * @param id The ID of the File to download
     * @param callback The callback
     */
    getDownloadStream(id: string, callback: ClientMethodCallback<Stream>): void;
    /**
     * @summary Gets a download stream for a File from Catalytic
     *
     * @param id The ID of the File to download
     * @param callback The optional callback
     */
    getDownloadStream(id: string, callback?: ClientMethodCallback<Stream>): Promise<Stream> | void {
        console.log(`Getting download stream for File '${id}'`);
        if (callback) {
            return this.callbackifyBound(this._getDownloadStream)(id, callback);
        }

        return this._getDownloadStream(id);
    }

    private _getDownloadStream(id: string): Promise<Stream> {
        // calls protected BaseClient method
        const endpoint = this._getDownloadEndpoint(id);
        return this.getFileDownloadStream(endpoint);
    }

    private _getDownloadEndpoint(id: string): string {
        return `/files/${id}/download`;
    }
}
