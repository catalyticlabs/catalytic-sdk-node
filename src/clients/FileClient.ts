import BaseClient from './BaseClient';
import { FileMetadata } from '../entities';

export default class FileClient extends BaseClient {
    async get(id: string): Promise<FileMetadata> {
        console.log(`Getting File with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getFile(id, { customHeaders: headers });
        return this.parseResponse<FileMetadata>(result);
    }
}
