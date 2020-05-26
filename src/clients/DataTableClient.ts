import BaseClient, { FindOptions } from './BaseClient';
import { DataTable, DataTablesPage } from '../entities';

export default class DataTableClient extends BaseClient {
    async get(id: string): Promise<DataTable> {
        console.log(`Getting DataTable with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getDataTable(id, { customHeaders: headers });
        return this.parseResponse<DataTable>(result);
    }

    async find(options?: FindDataTablesOptions): Promise<DataTablesPage> {
        console.log('Finding DataTables');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findDataTables(Object.assign({}, options, { customHeaders: headers }));
        return this.parseResponse<DataTablesPage>(result);
    }
}

export class FindDataTablesOptions extends FindOptions {}
