import BaseClient from './BaseClient';
import { Workflow } from '../entities';

export default class WorkflowClient extends BaseClient {
    async get(id: string): Promise<Workflow> {
        console.log(`Getting Workflow with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getWorkflow(id, { customHeaders: headers });
        return this.parseResponse<Workflow>(result);
    }
}
