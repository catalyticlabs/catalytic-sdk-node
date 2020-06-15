import BaseClient, { FindOptions, ClientMethodCallback } from './BaseClient';
import { Instance, InstancesPage, InstanceStep } from '../entities';
import {
    CatalyticSDKAPIFindInstanceStepsOptionalParams,
    StartInstanceRequest,
    ReassignStepRequest,
    CompleteStepRequest
} from '../internal/lib/models';

export default class InstanceClient extends BaseClient {
    static entity = 'Instance';

    /**
     * @summary Gets a Instance by ID
     *
     * @param id The ID of the Instance to get
     * @returns The Instance with the provided ID
     */
    get(id: string): Promise<Instance>;
    /**
     * @summary Gets a Instance by ID
     *
     * @param id The ID of the Instance to get
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<Instance>): void;
    /**
     * @summary Gets a Instance by ID
     *
     * @param id The ID of the Instance to get
     * @param callback The optional callback
     * @returns The Instance with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<Instance>): Promise<Instance> | void {
        if (callback) {
            return this.callbackifyBound(this._get)(id, callback);
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
     * @summary Finds Instances
     *
     * @returns A page of Instances
     */
    find(): Promise<InstancesPage>;
    /**
     * @summary Finds Instances
     *
     * @param options Filter criteria to narrow Instances returned
     * @returns A page of Instances
     */
    find(options: FindInstancesOptions): Promise<InstancesPage>;
    /**
     * @summary Finds Instances
     *
     * @param callback The callback
     */
    find(callback: ClientMethodCallback<InstancesPage>): void;
    /**
     * @summary Finds Instances
     *
     * @param options Filter criteria to narrow Instances returned
     * @param callback The callback
     */
    find(options: FindInstancesOptions, callback: ClientMethodCallback<InstancesPage>): void;
    /**
     * @summary Finds Instances
     *
     * @param options Filter criteria to narrow Instances returned
     * @param callback The callback
     * @returns A page of Instances
     */
    find(
        options?: FindInstancesOptions | ClientMethodCallback<InstancesPage>,
        callback?: ClientMethodCallback<InstancesPage>
    ): Promise<InstancesPage> | void {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return this.callbackifyBound(this._find)(options as FindInstancesOptions, callback);
        }

        return this._find(options as FindInstancesOptions);
    }

    private async _find(options: FindInstancesOptions): Promise<InstancesPage> {
        console.log('Finding Instances');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findInstances(
            Object.assign(this.formatFindInstanceOptions(options), { customHeaders: headers })
        );
        return this.parseResponse<InstancesPage>(result);
    }

    private formatFindInstanceOptions(options?: FindInstancesOptions): CatalyticSDKAPIFindInstanceStepsOptionalParams {
        return {
            query: options?.query,
            pageToken: options?.pageToken,
            pageSize: options?.pageSize,
            owner: options?.owner,
            category: options?.category,
            processId: options?.workflowID
        };
    }

    /**
     * @summary Start a new Instance of a Workflow
     * @param workflowID The ID of the Workflow to start an Instance of
     * @returns The started Instance
     */
    start(workflowID: string): Promise<Instance>;
    /**
     * @summary Start a new Instance of a Workflow
     * @param workflowID The ID of the Workflow to start an Instance of
     * @param name The display Name to apply to the started Instance
     * @returns The started Instance
     */
    start(workflowID: string, name: string): Promise<Instance>;
    /**
     * @summary Start a new Instance of a Workflow
     * @param workflowID The ID of the Workflow to start an Instance of
     * @param name The display Name to apply to the started Instance
     * @param inputs The initial Fields to add to the Instance
     * @returns The started Instance
     */
    start(workflowID: string, inputs: FieldInput[]): Promise<Instance>;
    /**
     * @summary Start a new Instance of a Workflow
     * @param workflowID The ID of the Workflow to start an Instance of
     * @param name The display Name to apply to the started Instance
     * @param inputs The initial Fields to add to the Instance
     * @returns The started Instance
     */
    start(workflowID: string, name: string, inputs: FieldInput[]): Promise<Instance>;
    /**
     * @summary Start a new Instance of a Workflow
     * @param workflowID The ID of the Workflow to start an Instance of
     * @param callback The callback
     */
    start(workflowID: string, callback: ClientMethodCallback<Instance>): Promise<Instance>;
    /**
     * @summary Start a new Instance of a Workflow
     * @param workflowID The ID of the Workflow to start an Instance of
     * @param name The display Name to apply to the started Instance
     * @param callback The callback
     */
    start(workflowID: string, name: string, callback: ClientMethodCallback<Instance>): Promise<Instance>;
    /**
     * @summary Start a new Instance of a Workflow
     * @param workflowID The ID of the Workflow to start an Instance of
     * @param inputs The initial Fields to add to the Instance
     * @param callback The callback
     */
    start(workflowID: string, inputs: FieldInput[], callback: ClientMethodCallback<Instance>): Promise<Instance>;
    /**
     * @summary Start a new Instance of a Workflow
     * @param workflowID The ID of the Workflow to start an Instance of
     * @param name The display Name to apply to the started Instance
     * @param inputs The initial Fields to add to the Instance
     * @param callback The callback
     */
    start(
        workflowID: string,
        name: string,
        inputs: FieldInput[],
        callback: ClientMethodCallback<Instance>
    ): Promise<Instance>;
    /**
     * @summary Start a new Instance of a Workflow
     * @param workflowID The ID of the Workflow to start an Instance of
     * @param name The display Name to apply to the started Instance
     * @param inputs The initial Fields to add to the Instance
     * @param callback The callback
     */
    start(
        workflowID: string,
        name: string | FieldInput[] | ClientMethodCallback<Instance> = null,
        inputs: FieldInput[] | ClientMethodCallback<Instance> = null,
        callback?: ClientMethodCallback<Instance>
    ): Promise<Instance> | void {
        if (typeof inputs === 'function') {
            callback = inputs;
            inputs = null;
        }

        if (Array.isArray(name)) {
            inputs = name;
            name = null;
        } else if (typeof name === 'function') {
            callback = name;
            name = null;
        }

        if (callback) {
            return this.callbackifyBound(this._start)(workflowID, name as string, inputs as FieldInput[], callback);
        }

        return this._start(workflowID, name as string, inputs as FieldInput[]);
    }

    private async _start(workflowID: string, name: string, inputs: FieldInput[]): Promise<Instance> {
        console.log(`Starting new Instance of Workflow '${workflowID}'`);

        const body: StartInstanceRequest = {
            workflowId: workflowID,
            name,
            inputFields: inputs
        };

        const result = await this.internalClient.startInstance({ body, customHeaders: this.getRequestHeaders() });
        return this.parseResponse<Instance>(result);
    }

    /**
     * @summary Stop an Instance by ID
     * @param id The ID of the Instance to stop
     * @returns The stopped Instance
     */
    stop(id: string): Promise<Instance>;
    /**
     * @summary Stop an Instance by ID
     * @param id The ID of the Instance to stop
     * @param callback The callback
     */
    stop(id: string, callback: ClientMethodCallback<Instance>): void;
    /**
     * @summary Stop an Instance by ID
     * @param id The ID of the Instance to stop
     * @param callback The optional callback
     * @returns The stopped Instance
     */
    stop(id: string, callback?: ClientMethodCallback<Instance>): Promise<Instance> | void {
        if (callback) {
            return this.callbackifyBound(this._stop)(id, callback);
        }
        return this._stop(id);
    }

    private async _stop(id: string): Promise<Instance> {
        console.log(`Stopping Instance '${id}'`);

        const result = await this.internalClient.stopInstance(id, { customHeaders: this.getRequestHeaders() });
        return this.parseResponse<Instance>(result);
    }

    /**
     * @summary Get an InstanceStep by ID
     * @param id The ID of the InstanceStep
     * @returns The InstanceStep with the provided ID
     */
    getInstanceStep(id: string): Promise<InstanceStep>;
    /**
     * @summary Get an InstanceStep by ID
     * @param id The ID of the InstanceStep
     * @param callback The callback
     */
    getInstanceStep(id: string, callback: ClientMethodCallback<InstanceStep>): void;
    /**
     * @summary Get an InstanceStep by ID
     * @param id The ID of the InstanceStep
     * @param callback The optional callback
     * @returns The InstanceStep with the provided ID
     */
    getInstanceStep(id: string, callback?: ClientMethodCallback<InstanceStep>): Promise<InstanceStep> | void {
        if (callback) {
            return this.callbackifyBound(this._getStep)(id, callback);
        }

        return this._getStep(id);
    }

    private async _getStep(id: string): Promise<InstanceStep> {
        console.log(`Getting InstanceStep '${id}'`);
        const result = await this.internalClient.getInstanceStep(id, '*', {
            customHeaders: this.getRequestHeaders()
        });

        return this.parseResponse<InstanceStep>(result);
    }

    /**
     * @summary Finds InstanceSteps
     *
     * @returns A page of InstanceSteps
     */
    findInstanceSteps(): Promise<InstancesPage>;
    /**
     * @summary Finds InstanceSteps
     *
     * @param options Filter criteria to narrow InstanceSteps returned
     * @returns A page of InstanceSteps
     */
    findInstanceSteps(options: FindInstanceStepsOptions): Promise<InstancesPage>;
    /**
     * @summary Finds InstanceSteps
     *
     * @param callback The callback
     */
    findInstanceSteps(callback: ClientMethodCallback<InstancesPage>): void;
    /**
     * @summary Finds InstanceSteps
     *
     * @param options Filter criteria to narrow InstanceSteps returned
     * @param callback The callback
     */
    findInstanceSteps(options: FindInstanceStepsOptions, callback: ClientMethodCallback<InstancesPage>): void;
    /**
     * @summary Finds InstanceSteps
     *
     * @param options Filter criteria to narrow InstanceSteps returned
     * @param callback The callback
     * @returns A page of InstanceSteps
     */
    findInstanceSteps(
        options?: FindInstanceStepsOptions | ClientMethodCallback<InstancesPage>,
        callback?: ClientMethodCallback<InstancesPage>
    ): Promise<InstancesPage> | void {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return this.callbackifyBound(this._findInstanceSteps)(options as FindInstanceStepsOptions, callback);
        }

        return this._findInstanceSteps(options as FindInstanceStepsOptions);
    }

    private async _findInstanceSteps(options: FindInstanceStepsOptions): Promise<InstancesPage> {
        console.log('Finding InstanceSteps');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findInstanceSteps(
            '*',
            Object.assign(this.formatFindInstanceStepOptions(options), { customHeaders: headers })
        );
        return this.parseResponse<InstancesPage>(result);
    }

    private formatFindInstanceStepOptions(
        options?: FindInstanceStepsOptions
    ): CatalyticSDKAPIFindInstanceStepsOptionalParams {
        return {
            query: options?.query,
            pageToken: options?.pageToken,
            pageSize: options?.pageSize,
            participatingUsers: options?.assignee,
            processId: options?.workflowID,
            runId: options?.instanceID
        };
    }

    /**
     * @summary Reassign an InstanceStep
     * @param id The ID of the InstanceStep
     * @param newAssigneeEmailAddress The email address of the Catalytic user to whom the step should be reassigned
     * @returns The reassigned InstanceStep
     */
    reassignInstanceStep(id: string, newAssigneeEmailAddress: string): Promise<InstanceStep>;
    /**
     * @summary Reassign an InstanceStep
     * @param id The ID of the InstanceStep
     * @param newAssigneeEmailAddress The email address of the Catalytic user to whom the step should be reassigned
     * @param callback The callback
     */
    reassignInstanceStep(
        id: string,
        newAssigneeEmailAddress: string,
        callback: ClientMethodCallback<InstanceStep>
    ): void;
    /**
     * @summary Reassign an InstanceStep
     * @param id The ID of the InstanceStep
     * @param newAssigneeEmailAddress The email address of the Catalytic user to whom the step should be reassigned
     * @param callback The optional callback
     * @returns The reassigned InstanceStep
     */
    reassignInstanceStep(
        id: string,
        newAssigneeEmailAddress: string,
        callback?: ClientMethodCallback<InstanceStep>
    ): Promise<InstanceStep> | void {
        if (callback) {
            return this.callbackifyBound(this._reassignStep)(id, newAssigneeEmailAddress, callback);
        }

        return this._reassignStep(id, newAssigneeEmailAddress);
    }

    private async _reassignStep(id: string, newAssigneeEmailAddress: string): Promise<InstanceStep> {
        console.log(`Reassigned InstanceStep ${id} to ${newAssigneeEmailAddress}`);

        const body: ReassignStepRequest = {
            id,
            assignTo: newAssigneeEmailAddress
        };
        const result = await this.internalClient.reassignStep(id, '*', {
            customHeaders: this.getRequestHeaders(),
            body
        });

        return this.parseResponse<InstanceStep>(result);
    }

    /**
     * @summary Complete an InstanceStep with no output fields
     * @param id The ID of the InstanceStep to complete
     * @returns The completed InstanceStep
     */
    completeInstanceStep(id: string): Promise<InstanceStep>;
    /**
     * @summary Complete an InstanceStep with output fields
     * @param id The ID of the InstanceStep to complete
     * @param fields Output fields to attached to the Instance Step
     * @returns The completed InstanceStep
     */
    completeInstanceStep(id: string, fields: FieldInput[]): Promise<InstanceStep>;
    /**
     * @summary Complete an InstanceStep with no output fields
     * @param id The ID of the InstanceStep to complete
     * @param callback The callback
     */
    completeInstanceStep(id: string, callback: ClientMethodCallback<InstanceStep>): void;
    /**
     * @summary Complete an InstanceStep with output fields
     * @param id The ID of the InstanceStep to complete
     * @param fields Output fields to attached to the Instance Step
     * @param callback The callback
     */
    completeInstanceStep(id: string, fields: FieldInput[], callback: ClientMethodCallback<InstanceStep>): void;
    /**
     * @summary Complete an InstanceStep
     * @param id The ID of the InstanceStep to complete
     * @param fields Output fields to attached to the Instance Step
     * @param callback The optional callback
     * @returns The completed InstanceStep
     */
    completeInstanceStep(
        id: string,
        fields: FieldInput[] | ClientMethodCallback<InstanceStep> = null,
        callback?: ClientMethodCallback<InstanceStep>
    ): Promise<InstanceStep> | void {
        console.log(`Completing InstanceStep '${id}' with ${fields?.length} fields`);
        if (typeof fields === 'function') {
            callback = fields;
            fields = null;
        }

        if (callback) {
            return this.callbackifyBound(this._completeStep)(id, fields as FieldInput[], callback);
        }

        return this._completeStep(id, fields as FieldInput[]);
    }

    private async _completeStep(id: string, fields: FieldInput[]): Promise<InstanceStep> {
        const body: CompleteStepRequest = {
            id,
            stepOutputFields: fields
        };

        const result = await this.internalClient.completeStep(id, '*', {
            body,
            customHeaders: this.getRequestHeaders()
        });
        return this.parseResponse<InstanceStep>(result);
    }
}

export interface FieldInput {
    /**
     * @summary The name or referenceName of the Field on the Instance
     */
    name: string;
    /**
     * @summary The string-serialized value of the Field
     */
    value: string;
}

export interface FindInstancesOptions extends FindOptions {
    /**
     * @summary Workflow ID to search for
     */
    workflowID?: string;
    /**
     * @summary Instance owner to search for
     */
    owner?: string;
    /**
     * @summary Instance category to search for
     */
    category?: string;
}

export interface FindInstanceStepsOptions extends FindOptions {
    /**
     * @summary Workflow ID to search for
     */
    workflowID?: string;
    /**
     * @summary Instance ID to search for
     */
    instanceID?: string;
    /**
     * @summary The email or username of the Catalytic user to which the InstanceSteps are assigned. Results will include InstanceSteps assigned to groups to which the user belongs
     */
    assignee?: string;
}
