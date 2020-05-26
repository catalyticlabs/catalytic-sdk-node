import BaseClient, { FindOptions } from './BaseClient';
import { Workflow, WorkflowsPage } from '../entities';

export default class WorkflowClient extends BaseClient {
    async get(id: string): Promise<Workflow> {
        console.log(`Getting Workflow with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getWorkflow(id, { customHeaders: headers });
        return this.parseResponse<Workflow>(result);
    }

    async find(options?: FindWorkflowOptions): Promise<WorkflowsPage> {
        console.log('Finding workflows');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findWorkflows(Object.assign({}, options, { customHeaders: headers }));
        return this.parseResponse<WorkflowsPage>(result);
    }
}

export class FindWorkflowOptions extends FindOptions {
    /**
     * Workflow owner to search for
     */
    owner?: string;
    /**
     * Workflow category to search for
     */
    category?: string;
}
