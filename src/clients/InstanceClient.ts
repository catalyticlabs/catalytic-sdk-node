import BaseClient, { FindOptions } from './BaseClient';
import { Instance, InstancesPage } from '../entities';
import { CatalyticSDKAPIFindInstanceStepsOptionalParams } from '../internal/lib/models';

function formatFindInstanceOptions(options?: FindInstanceOptions): CatalyticSDKAPIFindInstanceStepsOptionalParams {
    return {
        query: options?.query,
        pageToken: options?.pageToken,
        pageSize: options?.pageSize,
        owner: options?.owner,
        category: options?.category,
        processId: options?.workflowID
    };
}

export default class InstanceClient extends BaseClient {
    async get(id: string): Promise<Instance> {
        console.log(`Getting Instance with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getInstance(id, { customHeaders: headers });
        return this.parseResponse<Instance>(result);
    }

    async find(options?: FindInstanceOptions): Promise<InstancesPage> {
        console.log('Finding Instances');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findInstances(
            Object.assign({}, formatFindInstanceOptions(options), { customHeaders: headers })
        );
        return this.parseResponse<InstancesPage>(result);
    }
}

export class FindInstanceOptions extends FindOptions {
    /**
     * A Workflow ID to search for
     */
    workflowID?: string;
    /**
     * Instance owner to search for
     */
    owner?: string;
    /**
     * Instance category to search for
     */
    category?: string;
}
