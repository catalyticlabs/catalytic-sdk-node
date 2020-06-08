import { callbackify } from 'util';

import BaseClient, { FindOptions, ClientMethodCallback } from './BaseClient';
import { Workflow, WorkflowsPage, FileMetadata } from '../entities';
import { WorkflowImport, WorkflowExport } from '../internal/lib/models';
import { WorkflowImportError, WorkflowExportError } from '../errors';

export default class WorkflowClient extends BaseClient {
    static entity = 'Workflow';

    /**
     * Gets a Workflow by ID
     *
     * @param id The ID of the Workflow to get
     * @returns The Workflow with the provided ID
     */
    get(id: string): Promise<Workflow>;
    /**
     * Gets a Workflow by ID
     *
     * @param id The ID of the Workflow to get
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<Workflow>): void;
    /**
     * Gets a Workflow by ID
     *
     * @param id The ID of the Workflow to get
     * @param callback The optional callback
     * @returns The Workflow with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<Workflow>): Promise<Workflow> {
        if (callback) {
            return callbackify(this._get).call(this, id, callback);
        }

        return this._get(id);
    }

    private async _get(id: string): Promise<Workflow> {
        console.log(`Getting Workflow with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getWorkflow(id, { customHeaders: headers });
        return this.parseResponse<Workflow>(result);
    }

    /**
     * Finds Workflows
     *
     * @returns A page of Workflows
     */
    find(): Promise<WorkflowsPage>;
    /**
     * Finds Workflows
     *
     * @param options Filter criteria to narrow Workflows returned
     * @returns A page of Workflows
     */
    find(options: FindWorkflowOptions): Promise<WorkflowsPage>;
    /**
     * Finds Workflows
     * @param callback The callback
     */
    find(callback: ClientMethodCallback<WorkflowsPage>);
    /**
     * Finds Workflows
     *
     * @param options Filter criteria to narrow Workflows returned
     * @param callback The callback
     */
    find(options: FindWorkflowOptions, callback: ClientMethodCallback<WorkflowsPage>): void;
    /**
     * Finds Workflows
     *
     * @param options Filter criteria to narrow Workflows returned
     * @param callback The callback
     * @returns A page of Workflows
     */
    find(
        options?: FindWorkflowOptions | ClientMethodCallback<WorkflowsPage>,
        callback?: ClientMethodCallback<WorkflowsPage>
    ): Promise<WorkflowsPage> {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return callbackify(this._find).call(this, options, callback);
        }

        return this._find(options as FindWorkflowOptions);
    }

    private async _find(options?: FindWorkflowOptions): Promise<WorkflowsPage> {
        console.log('Finding Workflows');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findWorkflows(Object.assign({}, options, { customHeaders: headers }));
        return this.parseResponse<WorkflowsPage>(result);
    }

    /**
     * Import a Catalytic Workflow from an exported .catalytic file
     *
     * @param filePath The path to the .catalytic file on disk
     * @returns The imported Workflow
     */
    import(filePath: string): Promise<Workflow>;
    /**
     * Import a Catalytic Workflow from an exported .catalytic file
     *
     * @param filePath The path to the .catalytic file on disk
     * @param callback The callback
     */
    import(filePath: string, callback: ClientMethodCallback<Workflow>): void;
    /**
     * Import a Catalytic Workflow from an exported .catalytic file
     *
     * @param filePath The path to the .catalytic file on disk
     * @param password [Optional] The password used to secure the .catalytic export file, if applicable
     * @returns The imported Workflow
     */
    import(filePath: string, password: string): Promise<Workflow>;
    /**
     * Import a Catalytic Workflow from an exported .catalytic file
     *
     * @param filePath The path to the .catalytic file on disk
     * @param password [Optional] The password used to secure the .catalytic export file, if applicable
     * @param callback The callback
     */
    import(filePath: string, password: string, callback: ClientMethodCallback<Workflow>): void;
    /**
     * Import a Catalytic Workflow from an exported .catalytic file
     *
     * @param filePath The path to the .catalytic file on disk
     * @param password [Optional] The password used to secure the .catalytic export file, if applicable
     * @param callback The callback
     * @returns The imported Workflow
     */
    import(
        filePath: string,
        password?: string | ClientMethodCallback<Workflow>,
        callback?: ClientMethodCallback<Workflow>
    ): Promise<Workflow> {
        if (typeof password == 'function') {
            callback = password;
            password = null;
        }

        if (callback) {
            return callbackify(this._import).call(this, filePath, password, callback);
        }

        return this._import(filePath, typeof password == 'string' ? password : undefined);
    }

    private async _import(filePath: string, password?: string): Promise<Workflow> {
        console.log(`Importing Workflow from file '${filePath}'`);

        // Calls protected BaseClient.uploadFile
        const file = await this.uploadFile(filePath);

        const headers = this.getRequestHeaders();
        const request = {
            body: {
                fileId: file.id,
                password
            },
            customHeaders: headers
        };

        const importResult = await this.internalClient.importWorkflow(request);
        let workflowImport = this.parseResponse<WorkflowImport>(importResult);

        while (!workflowImport.workflowId) {
            const pollResult = await this.internalClient.getWorkflowImport(workflowImport.id, {
                customHeaders: headers
            });
            workflowImport = this.parseResponse<WorkflowImport>(pollResult);

            if (workflowImport.errorMessage) {
                throw new WorkflowImportError(workflowImport.errorMessage);
            }

            if (!workflowImport.workflowId) {
                // 1 second poll interval
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return await this._get(workflowImport.workflowId);
    }

    /**
     * Export a Catalytic Workflow to a .catalytic file
     *
     * @param id The ID of the Workflow to export
     * @returns The FileMetadata corresponding to the .catalytic Workflow export file
     */
    export(id: string): Promise<FileMetadata>;
    /**
     * Export a Catalytic Workflow to a .catalytic file
     *
     * @param id The ID of the Workflow to export
     * @param callback The callback
     */
    export(id: string, callback: ClientMethodCallback<FileMetadata>): void;
    /**
     * Export a Catalytic Workflow to a .catalytic file
     *
     * @param id The ID of the Workflow to export
     * @param password [Optional] The password used to secure the .catalytic export file
     * @returns The FileMetadata corresponding to the .catalytic Workflow export file
     */
    export(id: string, password: string): Promise<FileMetadata>;
    /**
     * Export a Catalytic Workflow to a .catalytic file
     *
     * @param id The ID of the Workflow to export
     * @param password [Optional] The password used to secure the .catalytic export file
     * @param callback The callback
     */
    export(id: string, password: string, callback: ClientMethodCallback<FileMetadata>): void;
    /**
     * Export a Catalytic Workflow to a .catalytic file
     *
     * @param id The ID of the Workflow to export
     * @param password [Optional] The password used to secure the .catalytic export file
     * @param callback The callback
     * @returns The FileMetadata corresponding to the .catalytic Workflow export file
     */
    export(
        id: string,
        password?: string | ClientMethodCallback<FileMetadata>,
        callback?: ClientMethodCallback<FileMetadata>
    ): Promise<FileMetadata> {
        if (typeof password == 'function') {
            callback = password;
            password = null;
        }

        if (callback) {
            return callbackify(this._export).call(this, id, password, callback);
        }

        return this._export(id, typeof password == 'string' ? password : undefined);
    }

    private async _export(id: string, password?: string): Promise<FileMetadata> {
        console.log(`Exporting Workflow with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const request = {
            body: {
                workflowId: id,
                password
            },
            customHeaders: headers
        };

        const exportResult = await this.internalClient.exportWorkflow(id, request);
        let workflowExport = this.parseResponse<WorkflowExport>(exportResult);

        while (!workflowExport.fileId) {
            const pollResult = await this.internalClient.getWorkflowExport(workflowExport.id, {
                customHeaders: headers
            });
            workflowExport = this.parseResponse<WorkflowExport>(pollResult);

            if (workflowExport.errorMessage) {
                throw new WorkflowExportError(workflowExport.errorMessage);
            }

            if (!workflowExport.fileId) {
                // 1 second poll interval
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        const result = await this.internalClient.getFile(workflowExport.fileId, { customHeaders: headers });
        return this.parseResponse<FileMetadata>(result);
    }
}
export interface FindWorkflowOptions extends FindOptions {
    /**
     * Workflow owner to search for
     */
    owner?: string;
    /**
     * Workflow category to search for
     */
    category?: string;
}
