import { callbackify } from 'util';
import BaseClient, { FindOptions, ClientMethodCallback } from './BaseClient';
import { Instance, InstancesPage } from '../entities';
import { CatalyticSDKAPIFindInstanceStepsOptionalParams } from '../internal/lib/models';

export default class InstanceClient extends BaseClient {
    static entity = 'Instance';

    /**
     * Gets a Instance by ID
     *
     * @param id The ID of the Instance to get
     * @returns The Instance with the provided ID
     */
    get(id: string): Promise<Instance>;
    /**
     * Gets a Instance by ID
     *
     * @param id The ID of the Instance to get
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<Instance>): void;
    /**
     * Gets a Instance by ID
     *
     * @param id The ID of the Instance to get
     * @param callback The optional callback
     * @returns The Instance with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<Instance>): Promise<Instance> {
        if (callback) {
            return callbackify(this._get).call(this, id, callback);
        }

        return this._get(id);
    }

    private async _get(id: string): Promise<Instance> {
        console.log(`Getting Instance with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getInstance(id, { customHeaders: headers });
        return this.parseResponse<Instance>(result);
    }

    /**
     * Finds Instances
     *
     * @returns A page of Instances
     */
    find(): Promise<InstancesPage>;
    /**
     * Finds Instances
     *
     * @param options Filter criteria to narrow Instances returned
     * @returns A page of Instances
     */
    find(options: FindInstanceOptions): Promise<InstancesPage>;
    /**
     * Finds Instances
     *
     * @param callback The callback
     */
    find(callback: ClientMethodCallback<InstancesPage>): void;
    /**
     * Finds Instances
     *
     * @param options Filter criteria to narrow Instances returned
     * @param callback The callback
     */
    find(options: FindInstanceOptions, callback: ClientMethodCallback<InstancesPage>): void;
    /**
     * Finds Instances
     *
     * @param options Filter criteria to narrow Instances returned
     * @param callback The callback
     * @returns A page of Instances
     */
    find(
        options?: FindInstanceOptions | ClientMethodCallback<InstancesPage>,
        callback?: ClientMethodCallback<InstancesPage>
    ): Promise<InstancesPage> {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return callbackify(this._find).call(this, options, callback);
        }

        return this._find(options as FindInstanceOptions);
    }

    private async _find(options?: FindInstanceOptions): Promise<InstancesPage> {
        console.log('Finding Instances');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findInstances(
            Object.assign(this.formatFindInstanceOptions(options), { customHeaders: headers })
        );
        return this.parseResponse<InstancesPage>(result);
    }

    formatFindInstanceOptions(options?: FindInstanceOptions): CatalyticSDKAPIFindInstanceStepsOptionalParams {
        return {
            query: options?.query,
            pageToken: options?.pageToken,
            pageSize: options?.pageSize,
            owner: options?.owner,
            category: options?.category,
            processId: options?.workflowID
        };
    }
}

export interface FindInstanceOptions extends FindOptions {
    /**
     * Workflow ID to search for
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
