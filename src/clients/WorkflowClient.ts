import { callbackify } from 'util';
import BaseClient, { FindOptions, ClientMethodCallback } from './BaseClient';
import { Workflow, WorkflowsPage } from '../entities';

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
