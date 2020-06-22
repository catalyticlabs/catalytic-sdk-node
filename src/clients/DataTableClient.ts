import { Stream } from 'stream';

import { DataTable, DataTablesPage } from '../entities';
import { BaseFindOptions, ClientMethodCallback } from '../types';

import BaseClient from './BaseClient';

export default class DataTableClient extends BaseClient implements DataTableClientInterface {
    static entity = 'DataTable';

    get(id: string): Promise<DataTable>;
    get(id: string, callback: ClientMethodCallback<DataTable>): void;
    get(id: string, callback?: ClientMethodCallback<DataTable>): Promise<DataTable> | void {
        if (callback) {
            return this.callbackifyBound(this._get)(id, callback);
        }

        return this._get(id);
    }

    private async _get(id: string): Promise<DataTable> {
        console.log(`Getting DataTable with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.getDataTable(id, { customHeaders: headers });
        return this.parseResponse<DataTable>(result);
    }

    find(): Promise<DataTablesPage>;
    find(options: FindDataTablesOptions): Promise<DataTablesPage>;
    find(callback: ClientMethodCallback<DataTablesPage>): void;
    find(options: FindDataTablesOptions, callback: ClientMethodCallback<DataTablesPage>): void;
    find(
        options?: FindDataTablesOptions | ClientMethodCallback<DataTablesPage>,
        callback?: ClientMethodCallback<DataTablesPage>
    ): Promise<DataTablesPage> | void {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return this.callbackifyBound(this._find)(options as FindDataTablesOptions, callback);
        }

        return this._find(options as FindDataTablesOptions);
    }

    private async _find(options: FindDataTablesOptions): Promise<DataTablesPage> {
        console.log('Finding DataTables');
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.findDataTables(Object.assign({}, options, { customHeaders: headers }));
        return this.parseResponse<DataTablesPage>(result);
    }

    download(id: string, format: DataTableExportFormat, path: string): Promise<void>;
    download(id: string, format: DataTableExportFormat, path: string, callback: ClientMethodCallback<void>): void;
    download(
        id: string,
        format: DataTableExportFormat,
        path: string,
        callback?: ClientMethodCallback<void>
    ): Promise<void> | void {
        console.log(`Downloading Data Table '${id}' to '${path}' with format '${format}'`);
        if (callback) {
            return this.callbackifyBound(this._download)(id, format, path, callback);
        }

        return this._download(id, format, path);
    }

    private _download(id: string, format: DataTableExportFormat, path: string): Promise<void> {
        // Calls protected BaseClient method
        const endpoint = this._getDownloadEndpoint(id, format);
        return this.downloadFile(endpoint, path);
    }

    getDownloadStream(id: string, format: DataTableExportFormat): Promise<Stream>;
    getDownloadStream(id: string, format: DataTableExportFormat, callback: ClientMethodCallback<Stream>): void;
    getDownloadStream(
        id: string,
        format: DataTableExportFormat,
        callback?: ClientMethodCallback<Stream>
    ): Promise<Stream> | void {
        console.log(`Getting download stream for Data Table ${id}`);
        if (callback) {
            return this.callbackifyBound(this._getDownloadStream)(id, format, callback);
        }

        return this._getDownloadStream(id, format);
    }

    private _getDownloadStream(id: string, format: DataTableExportFormat): Promise<Stream> {
        const endpoint = this._getDownloadEndpoint(id, format);
        return this.getFileDownloadStream(endpoint);
    }

    private _getDownloadEndpoint(id: string, format: DataTableExportFormat): string {
        return `/tables/${id}/download?format=${format}`;
    }

    upload(filePath: string): Promise<DataTable>;
    upload(filePath: string, tableName: string): Promise<DataTable>;
    upload(filePath: string, tableName: string, headerRow: number): Promise<DataTable>;
    upload(filePath: string, tableName: string, headerRow: number, sheetNumber: number): Promise<DataTable>;
    upload(filePath: string, callback: ClientMethodCallback<DataTable>): void;
    upload(filePath: string, tableName: string, callback: ClientMethodCallback<DataTable>): void;
    upload(filePath: string, tableName: string, headerRow: number, callback: ClientMethodCallback<DataTable>): void;
    upload(
        filePath: string,
        tableName: string,
        headerRow: number,
        sheetNumber: number,
        callback: ClientMethodCallback<DataTable>
    ): void;
    upload(
        filePath: string,
        tableName: string | ClientMethodCallback<DataTable> = null,
        headerRow: number | ClientMethodCallback<DataTable> = 1,
        sheetNumber: number | ClientMethodCallback<DataTable> = 1,
        callback?: ClientMethodCallback<DataTable>
    ): Promise<DataTable> | void {
        if (typeof tableName === 'function') {
            callback = tableName;
            tableName = null;
        }

        if (typeof headerRow === 'function') {
            callback = headerRow;
            headerRow = 1;
        }

        if (typeof sheetNumber === 'function') {
            callback = sheetNumber;
            sheetNumber = 1;
        }

        if (callback) {
            return this.callbackifyBound(this._upload)(
                filePath,
                tableName as string,
                headerRow as number,
                sheetNumber as number,
                callback
            );
        }

        return this._upload(filePath, tableName as string, headerRow as number, sheetNumber as number);
    }

    private _upload(filePath: string, tableName: string, headerRow: number, sheetNumber: number): Promise<DataTable> {
        // Calls protected BaseClient.uploadFile method
        return this.uploadFile(filePath, this._getUploadEndpoint(tableName, headerRow, sheetNumber));
    }

    replace(id: string, filePath: string): Promise<DataTable>;
    replace(id: string, filePath: string, headerRow: number): Promise<DataTable>;
    replace(id: string, filePath: string, headerRow: number, sheetNumber: number): Promise<DataTable>;
    replace(id: string, filePath: string, callback: ClientMethodCallback<DataTable>): void;
    replace(id: string, filePath: string, headerRow: number, callback: ClientMethodCallback<DataTable>): void;
    replace(
        id: string,
        filePath: string,
        headerRow: number,
        sheetNumber: number,
        callback: ClientMethodCallback<DataTable>
    ): void;
    replace(
        id: string,
        filePath: string,
        headerRow: number | ClientMethodCallback<DataTable> = 1,
        sheetNumber: number | ClientMethodCallback<DataTable> = 1,
        callback?: ClientMethodCallback<DataTable>
    ): Promise<DataTable> | void {
        if (typeof headerRow === 'function') {
            callback = headerRow;
            headerRow = 1;
        }

        if (typeof sheetNumber === 'function') {
            callback = sheetNumber;
            sheetNumber = 1;
        }

        if (callback) {
            return this.callbackifyBound(this._replace)(id, filePath, headerRow, sheetNumber, callback);
        }

        return this._replace(id, filePath, headerRow, sheetNumber);
    }

    private async _replace(id: string, filePath: string, headerRow: number, sheetNumber: number): Promise<DataTable> {
        const endpoint = this._getReplaceEndpoint(id, headerRow, sheetNumber);
        return this.uploadFile(filePath, endpoint);
    }

    private _getUploadEndpoint(tableName: string, headerRow: number, sheetNumber: number): string {
        return `/tables:upload?headerRow=${headerRow}&sheetNumber=${sheetNumber}${
            tableName ? `&tableName=${encodeURIComponent(tableName)}` : ''
        }`;
    }

    private _getReplaceEndpoint(id: string, headerRow: number, sheetNumber: number): string {
        return `/tables/${id}:replace?headerRow=${headerRow}&sheetNumber=${sheetNumber}`;
    }
}

export interface DataTableClientInterface {
    /**
     * @summary Gets a DataTable by ID
     *
     * @param id The ID of the DataTable to get
     * @returns The DataTable with the provided ID
     */
    get(id: string): Promise<DataTable>;
    /**
     * @summary Gets a DataTable by ID
     *
     * @param id The ID of the DataTable to get
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<DataTable>): void;
    /**
     * @summary Gets a DataTable by ID
     *
     * @param id The ID of the DataTable to get
     * @param callback The optional callback
     * @returns The DataTable with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<DataTable>): Promise<DataTable> | void;

    /**
     * @summary Finds DataTables
     *
     * @returns A page of DataTables
     */
    find(): Promise<DataTablesPage>;
    /**
     * @summary Finds DataTables
     *
     * @param options Filter criteria to narrow DataTables returned
     * @returns A page of DataTables
     */
    find(options: FindDataTablesOptions): Promise<DataTablesPage>;
    /**
     * @summary Finds DataTables
     *
     * @param callback The callback
     */
    find(callback: ClientMethodCallback<DataTablesPage>): void;
    /**
     * @summary Finds DataTables
     *
     * @param options Filter criteria to narrow DataTables returned
     * @param callback The callback
     */
    find(options: FindDataTablesOptions, callback: ClientMethodCallback<DataTablesPage>): void;
    /**
     * @summary Finds DataTables
     *
     * @param options Filter criteria to narrow DataTables returned
     * @param callback The callback
     * @returns A page of DataTables
     */
    find(
        options?: FindDataTablesOptions | ClientMethodCallback<DataTablesPage>,
        callback?: ClientMethodCallback<DataTablesPage>
    ): Promise<DataTablesPage> | void;

    /**
     * @summary Downloads a Data Table from Catalytic as CSV or XLSX file
     *
     * @param id The ID of the Data Table to download
     * @param format The download stream content format ('xlsx' or 'csv')
     * @param path The path to which the file should be downloaded
     * @returns A Promise that resolves when file has been written
     */
    download(id: string, format: DataTableExportFormat, path: string): Promise<void>;
    /**
     * @summary Downloads a Data Table from Catalytic as a CSV or XLSX file
     *
     * @param id The ID of the Data Table to download
     * @param format The download stream content format ('xlsx' or 'csv')
     * @param path The path to which the file should be downloaded
     * @param callback The callback
     */
    download(id: string, format: DataTableExportFormat, path: string, callback: ClientMethodCallback<void>): void;
    /**
     * @summary Downloads a Data Table from Catalytic as a CSV or XLSX file
     *
     * @param id The ID of the Data Table to download
     * @param format The download stream content format ('xlsx' or 'csv')
     * @param path The path to which the file should be downloaded
     * @param callback The optional callback
     */
    download(
        id: string,
        format: DataTableExportFormat,
        path: string,
        callback?: ClientMethodCallback<void>
    ): Promise<void> | void;

    /**
     * @summary Gets a download stream for a Catalytic DataTable
     *
     * @param id The ID of the Data Table to download
     * @param format The download stream content format ('xlsx' or 'csv')
     * @returns A Promise that resolves with the Data Table download stream
     */
    getDownloadStream(id: string, format: DataTableExportFormat): Promise<Stream>;
    /**
     * @summary Gets a download stream for a Catalytic DataTable
     *
     * @param id The ID of the Data Table to download
     * @param format The download stream content format ('xlsx' or 'csv')
     * @param callback The callback
     */
    getDownloadStream(id: string, format: DataTableExportFormat, callback: ClientMethodCallback<Stream>): void;
    /**
     * @summary Gets a download stream for a Catalytic DataTable
     *
     * @param id The ID of the Data Table to download
     * @param format The download stream content format ('xlsx' or 'csv')
     * @param callback The optional callback
     * @returns A Promise that resolves with the Data Table download stream
     */
    getDownloadStream(
        id: string,
        format: DataTableExportFormat,
        callback?: ClientMethodCallback<Stream>
    ): Promise<Stream> | void;

    /**
     * @summary Uploads a CSV or Excel file to create a new Data Table
     *
     * @param filePath The path of the CSV or Excel file on disk
     * @returns The newly created Data Table
     */
    upload(filePath: string): Promise<DataTable>;
    /**
     * @summary Uploads a CSV or Excel file to create a new Data Table
     *
     * @param filePath The path of the CSV or Excel file on disk
     * @param tableName The name of the table to create. Defaults to the file name without the extension
     * @returns The newly created Data Table
     */
    upload(filePath: string, tableName: string): Promise<DataTable>;
    /**
     * @summary Uploads a CSV or Excel file to create a new Data Table
     *
     * @param filePath The path of the CSV or Excel file on disk
     * @param tableName The name of the table to create. Defaults to the file name without the extension
     * @param headerRow The row number that contains the column headers. Defaults to 1.
     * @returns The newly created Data Table
     */
    upload(filePath: string, tableName: string, headerRow: number): Promise<DataTable>;
    /**
     * @summary Uploads a CSV or Excel file to create a new Data Table
     *
     * @param filePath The path of the CSV or Excel file on disk
     * @param tableName The name of the table to create. Defaults to the file name without the extension
     * @param headerRow The row number that contains the column headers. Defaults to 1.
     * @param sheetNumber The number of the sheet to import. Only applies to Excel files. The first sheet is imported by default.
     * @returns The newly created Data Table
     */
    upload(filePath: string, tableName: string, headerRow: number, sheetNumber: number): Promise<DataTable>;
    /**
     * @summary Uploads a CSV or Excel file to create a new Data Table
     *
     * @param filePath The path of the CSV or Excel file on disk
     * @param callback The callback
     */
    upload(filePath: string, callback: ClientMethodCallback<DataTable>): void;
    /**
     * @summary Uploads a CSV or Excel file to create a new Data Table
     *
     * @param filePath The path of the CSV or Excel file on disk
     * @param tableName The name of the table to create. Defaults to the file name without the extension
     * @param callback The callback
     */
    upload(filePath: string, tableName: string, callback: ClientMethodCallback<DataTable>): void;
    /**
     * @summary Uploads a CSV or Excel file to create a new Data Table
     *
     * @param filePath The path of the CSV or Excel file on disk
     * @param tableName The name of the table to create. Defaults to the file name without the extension
     * @param headerRow The row number that contains the column headers. Defaults to 1.
     * @param callback The callback
     */
    upload(filePath: string, tableName: string, headerRow: number, callback: ClientMethodCallback<DataTable>): void;
    /**
     * @summary Uploads a CSV or Excel file to create a new Data Table
     *
     * @param filePath The path of the CSV or Excel file on disk
     * @param tableName The name of the table to create. Defaults to the file name without the extension
     * @param headerRow The row number that contains the column headers. Defaults to 1.
     * @param sheetNumber The number of the sheet to import. Only applies to Excel files. The first sheet is imported by default.
     * @param callback The optional callback
     */
    upload(
        filePath: string,
        tableName: string,
        headerRow: number,
        sheetNumber: number,
        callback: ClientMethodCallback<DataTable>
    ): void;
    /**
     * @summary Uploads a CSV or Excel file to create a new Data Table
     *
     * @param filePath The path of the CSV or Excel file on disk
     * @param tableName The name of the table to create. Defaults to the file name without the extension
     * @param headerRow The row number that contains the column headers. Defaults to 1.
     * @param sheetNumber The number of the sheet to import. Only applies to Excel files. The first sheet is imported by default.
     * @param callback The optional callback
     * @returns The newly created Data Table
     */
    upload(
        filePath: string,
        tableName?: string | ClientMethodCallback<DataTable>,
        headerRow?: number | ClientMethodCallback<DataTable>,
        sheetNumber?: number | ClientMethodCallback<DataTable>,
        callback?: ClientMethodCallback<DataTable>
    ): Promise<DataTable> | void;

    /**
     * @summary Replaces an existing Data Table with a CSV or Excel file
     *
     * @param id The ID of the Data Table to replace
     * @param filePath The path of the CSV or Excel file on disk
     * @returns The newly created Data Table
     */
    replace(id: string, filePath: string): Promise<DataTable>;
    /**
     * @summary Replaces an existing Data Table with a CSV or Excel file
     *
     * @param id The ID of the Data Table to replace
     * @param filePath The path of the CSV or Excel file on disk
     * @param headerRow The row number that contains the column headers. Defaults to 1.
     * @returns The newly created Data Table
     */
    replace(id: string, filePath: string, headerRow: number): Promise<DataTable>;
    /**
     * @summary Replaces an existing Data Table with a CSV or Excel file
     *
     * @param id The ID of the Data Table to replace
     * @param filePath The path of the CSV or Excel file on disk
     * @param headerRow The row number that contains the column headers. Defaults to 1.
     * @param sheetNumber The number of the sheet to import. Only applies to Excel files. The first sheet is imported by default.
     * @returns The newly created Data Table
     */
    replace(id: string, filePath: string, headerRow: number, sheetNumber: number): Promise<DataTable>;
    replace(id: string, filePath: string, callback: ClientMethodCallback<DataTable>): void;
    replace(id: string, filePath: string, headerRow: number, callback: ClientMethodCallback<DataTable>): void;
    replace(
        id: string,
        filePath: string,
        headerRow: number,
        sheetNumber: number,
        callback: ClientMethodCallback<DataTable>
    ): void;

    replace(
        id: string,
        filePath: string,
        headerRow?: number | ClientMethodCallback<DataTable>,
        sheetNumber?: number | ClientMethodCallback<DataTable>,
        callback?: ClientMethodCallback<DataTable>
    ): Promise<DataTable> | void;
}

export enum DataTableExportFormat {
    XLSX = 'xlsx',
    CSV = 'csv'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindDataTablesOptions extends BaseFindOptions {}
