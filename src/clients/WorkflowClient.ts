import BaseClient, { FindOptions, ClientMethodCallback } from './BaseClient';
import { Workflow, WorkflowsPage, FileMetadata, FileMetadataPage } from '../entities';
import { WorkflowImport, WorkflowExport } from '../internal/lib/models';
import { WorkflowImportError, WorkflowExportError } from '../errors';

export default class WorkflowClient extends BaseClient {
    static entity = 'Workflow';

    /**
     * @summary Gets a Workflow by ID
     *
     * @param id The ID of the Workflow to get
     * @returns The Workflow with the provided ID
     */
    get(id: string): Promise<Workflow>;
    /**
     * @summary Gets a Workflow by ID
     *
     * @param id The ID of the Workflow to get
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<Workflow>): void;
    /**
     * @summary Gets a Workflow by ID
     *
     * @param id The ID of the Workflow to get
     * @param callback The optional callback
     * @returns The Workflow with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<Workflow>): Promise<Workflow> | void {
        if (callback) {
            return this.callbackifyBound(this._get)(id, callback);
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
     * @summary Finds Workflows
     *
     * @returns A page of Workflows
     */
    find(): Promise<WorkflowsPage>;
    /**
     * @summary Finds Workflows
     *
     * @param options Filter criteria to narrow Workflows returned
     * @returns A page of Workflows
     */
    find(options: FindWorkflowOptions): Promise<WorkflowsPage>;
    /**
     * @summary Finds Workflows
     * @param callback The callback
     */
    find(callback: ClientMethodCallback<WorkflowsPage>);
    /**
     * @summary Finds Workflows
     *
     * @param options Filter criteria to narrow Workflows returned
     * @param callback The callback
     */
    find(options: FindWorkflowOptions, callback: ClientMethodCallback<WorkflowsPage>): void;
    /**
     * @summary Finds Workflows
     *
     * @param options Filter criteria to narrow Workflows returned
     * @param callback The callback
     * @returns A page of Workflows
     */
    find(
        options?: FindWorkflowOptions | ClientMethodCallback<WorkflowsPage>,
        callback?: ClientMethodCallback<WorkflowsPage>
    ): Promise<WorkflowsPage> | void {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return this.callbackifyBound(this._find)(options as FindWorkflowOptions, callback);
        }

        return this._find(options as FindWorkflowOptions);
    }

    private async _find(options: FindWorkflowOptions): Promise<WorkflowsPage> {
        console.log('Finding Workflows');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findWorkflows(Object.assign({}, options, { customHeaders: headers }));
        return this.parseResponse<WorkflowsPage>(result);
    }

    /**
     * @summary Import a Catalytic Workflow from an exported .catalytic file
     *
     * @param filePath The path to the .catalytic file on disk
     * @returns The imported Workflow
     */
    import(filePath: string): Promise<Workflow>;
    /**
     * @summary Import a Catalytic Workflow from an exported .catalytic file
     *
     * @param filePath The path to the .catalytic file on disk
     * @param callback The callback
     */
    import(filePath: string, callback: ClientMethodCallback<Workflow>): void;
    /**
     * @summary Import a Catalytic Workflow from an exported .catalytic file
     *
     * @param filePath The path to the .catalytic file on disk
     * @param password [Optional] The password used to secure the .catalytic export file, if applicable
     * @returns The imported Workflow
     */
    import(filePath: string, password: string): Promise<Workflow>;
    /**
     * @summary Import a Catalytic Workflow from an exported .catalytic file
     *
     * @param filePath The path to the .catalytic file on disk
     * @param password [Optional] The password used to secure the .catalytic export file, if applicable
     * @param callback The callback
     */
    import(filePath: string, password: string, callback: ClientMethodCallback<Workflow>): void;
    /**
     * @summary Import a Catalytic Workflow from an exported .catalytic file
     *
     * @param filePath The path to the .catalytic file on disk
     * @param password [Optional] The password used to secure the .catalytic export file, if applicable
     * @param callback The callback
     * @returns The imported Workflow
     */
    import(
        filePath: string,
        password: string | ClientMethodCallback<Workflow> = null,
        callback?: ClientMethodCallback<Workflow>
    ): Promise<Workflow> | void {
        if (typeof password == 'function') {
            callback = password;
            password = null;
        }

        if (callback) {
            return this.callbackifyBound(this._import)(filePath, password as string, callback);
        }

        return this._import(filePath, password as string);
    }

    private async _import(filePath: string, password: string): Promise<Workflow> {
        console.log(`Importing Workflow from file '${filePath}'`);

        // Calls protected BaseClient.uploadFile
        const files = await this.uploadFile<FileMetadataPage>(filePath);
        const file = files.files[0];
        if (!file) {
            throw new WorkflowImportError('Failed to upload .catalytic file');
        }

        const headers = this.getRequestHeaders();
        const request = {
            body: {
                fileId: file.id,
                password: password
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
     * @summary Export a Catalytic Workflow to a .catalytic file
     *
     * @param id The ID of the Workflow to export
     * @returns The FileMetadata corresponding to the .catalytic Workflow export file
     */
    export(id: string): Promise<FileMetadata>;
    /**
     * @summary Export a Catalytic Workflow to a .catalytic file
     *
     * @param id The ID of the Workflow to export
     * @param callback The callback
     */
    export(id: string, callback: ClientMethodCallback<FileMetadata>): void;
    /**
     * @summary Export a Catalytic Workflow to a .catalytic file
     *
     * @param id The ID of the Workflow to export
     * @param password [Optional] The password used to secure the .catalytic export file
     * @returns The FileMetadata corresponding to the .catalytic Workflow export file
     */
    export(id: string, password: string): Promise<FileMetadata>;
    /**
     * @summary Export a Catalytic Workflow to a .catalytic file
     *
     * @param id The ID of the Workflow to export
     * @param password [Optional] The password used to secure the .catalytic export file
     * @param callback The callback
     */
    export(id: string, password: string, callback: ClientMethodCallback<FileMetadata>): void;
    /**
     * @summary Export a Catalytic Workflow to a .catalytic file
     *
     * @param id The ID of the Workflow to export
     * @param password [Optional] The password used to secure the .catalytic export file
     * @param callback The callback
     * @returns The FileMetadata corresponding to the .catalytic Workflow export file
     */
    export(
        id: string,
        password: string | ClientMethodCallback<FileMetadata> = null,
        callback?: ClientMethodCallback<FileMetadata>
    ): Promise<FileMetadata> | void {
        if (typeof password == 'function') {
            callback = password;
            password = null;
        }

        if (callback) {
            return this.callbackifyBound(this._export)(id, password as string, callback);
        }

        return this._export(id, password as string);
    }

    private async _export(id: string, password: string): Promise<FileMetadata> {
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
     * @summary Workflow owner to search for
     */
    owner?: string;
    /**
     * @summary Workflow category to search for
     */
    category?: string;
}
