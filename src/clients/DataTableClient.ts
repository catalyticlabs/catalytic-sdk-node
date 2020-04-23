import BaseClient from './BaseClient';
import { DataTable } from '../entities';

export default class DataTableClient extends BaseClient {
    async get(id: string): Promise<DataTable> {
        console.log(`Getting DataTable with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getDataTable(id, { customHeaders: headers });
        return this.parseResponse<DataTable>(result);
    }
}
