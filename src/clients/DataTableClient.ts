import { callbackify } from 'util';

import BaseClient, { FindOptions, ClientMethodCallback } from './BaseClient';
import { DataTable, DataTablesPage } from '../entities';

export default class DataTableClient extends BaseClient {
    static entity = 'DataTable';

    /**
     * Gets a DataTable by ID
     *
     * @param id The ID of the DataTable to get
     * @returns The DataTable with the provided ID
     */
    get(id: string): Promise<DataTable>;
    /**
     * Gets a DataTable by ID
     *
     * @param id The ID of the DataTable to get
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<DataTable>): void;
    /**
     * Gets a DataTable by ID
     *
     * @param id The ID of the DataTable to get
     * @param callback The optional callback
     * @returns The DataTable with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<DataTable>): Promise<DataTable> {
        if (callback) {
            return callbackify(this._get).call(this, id, callback);
        }

        return this._get(id);
    }

    private async _get(id: string): Promise<DataTable> {
        console.log(`Getting DataTable with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getDataTable(id, { customHeaders: headers });
        return this.parseResponse<DataTable>(result);
    }

    /**
     * Finds DataTables
     *
     * @returns A page of DataTables
     */
    find(): Promise<DataTablesPage>;
    /**
     * Finds DataTables
     *
     * @param options Filter criteria to narrow DataTables returned
     * @returns A page of DataTables
     */
    find(options: FindDataTablesOptions): Promise<DataTablesPage>;
    /**
     * Finds DataTables
     *
     * @param callback The callback
     */
    find(callback: ClientMethodCallback<DataTablesPage>): void;
    /**
     * Finds DataTables
     *
     * @param options Filter criteria to narrow DataTables returned
     * @param callback The callback
     */
    find(options: FindDataTablesOptions, callback: ClientMethodCallback<DataTablesPage>): void;
    /**
     * Finds DataTables
     *
     * @param options Filter criteria to narrow DataTables returned
     * @param callback The callback
     * @returns A page of DataTables
     */
    find(
        options?: FindDataTablesOptions | ClientMethodCallback<DataTablesPage>,
        callback?: ClientMethodCallback<DataTablesPage>
    ): Promise<DataTablesPage> {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return callbackify(this._find).call(this, options, callback);
        }

        return this._find(options as FindDataTablesOptions);
    }

    private async _find(options?: FindDataTablesOptions): Promise<DataTablesPage> {
        console.log('Finding DataTables');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findDataTables(Object.assign({}, options, { customHeaders: headers }));
        return this.parseResponse<DataTablesPage>(result);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindDataTablesOptions extends FindOptions {}
