import { WildcardId } from '../constants';
import { Instance, InstancesPage, InstanceStep, InstanceStepsPage } from '../entities';
import { FieldInputError } from '../errors';
import {
    CatalyticSDKAPIFindInstanceStepsOptionalParams,
    StartInstanceRequest,
    ReassignStepRequest,
    CompleteStepRequest,
    CatalyticSDKAPIFindInstancesOptionalParams
} from '../internal/lib/models';
import { BaseFindOptions, ClientMethodCallback, FieldInput } from '../types';
import { displayNameToInternal } from '../utils';

import BaseClient from './BaseClient';

export default class InstanceClient extends BaseClient implements InstanceClientInterface {
    static entity = 'Instance';

    get(id: string): Promise<Instance>;
    get(id: string, callback: ClientMethodCallback<Instance>): void;
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

    find(): Promise<InstancesPage>;
    find(options: FindInstancesOptions): Promise<InstancesPage>;
    find(callback: ClientMethodCallback<InstancesPage>): void;
    find(options: FindInstancesOptions, callback: ClientMethodCallback<InstancesPage>): void;
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

    private formatFindInstanceOptions(options?: FindInstancesOptions): CatalyticSDKAPIFindInstancesOptionalParams {
        return {
            query: options?.query,
            pageToken: options?.pageToken,
            pageSize: options?.pageSize,
            owner: options?.owner,
            category: options?.category,
            processId: options?.workflowID
        };
    }

    start(workflowID: string): Promise<Instance>;
    start(workflowID: string, name: string): Promise<Instance>;
    start(workflowID: string, inputs: FieldInput[]): Promise<Instance>;
    start(workflowID: string, name: string, inputs: FieldInput[]): Promise<Instance>;
    start(workflowID: string, callback: ClientMethodCallback<Instance>): Promise<Instance>;
    start(workflowID: string, name: string, callback: ClientMethodCallback<Instance>): Promise<Instance>;
    start(workflowID: string, inputs: FieldInput[], callback: ClientMethodCallback<Instance>): Promise<Instance>;
    start(
        workflowID: string,
        name: string,
        inputs: FieldInput[],
        callback: ClientMethodCallback<Instance>
    ): Promise<Instance>;
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
            inputFields: this.formatFields(inputs)
        };

        const result = await this.internalClient.startInstance({ body, customHeaders: this.getRequestHeaders() });
        return this.parseResponse<Instance>(result);
    }

    stop(id: string): Promise<Instance>;
    stop(id: string, callback: ClientMethodCallback<Instance>): void;
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

    getInstanceStep(id: string): Promise<InstanceStep>;
    getInstanceStep(id: string, callback: ClientMethodCallback<InstanceStep>): void;
    getInstanceStep(id: string, callback?: ClientMethodCallback<InstanceStep>): Promise<InstanceStep> | void {
        if (callback) {
            return this.callbackifyBound(this._getStep)(id, callback);
        }

        return this._getStep(id);
    }

    private async _getStep(id: string): Promise<InstanceStep> {
        console.log(`Getting InstanceStep '${id}'`);
        const result = await this.internalClient.getInstanceStep(id, WildcardId, {
            customHeaders: this.getRequestHeaders()
        });

        return this.parseResponse<InstanceStep>(result);
    }

    findInstanceSteps(): Promise<InstancesPage>;
    findInstanceSteps(options: FindInstanceStepsOptions): Promise<InstancesPage>;
    findInstanceSteps(callback: ClientMethodCallback<InstancesPage>): void;
    findInstanceSteps(options: FindInstanceStepsOptions, callback: ClientMethodCallback<InstancesPage>): void;
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
            WildcardId,
            Object.assign(this.formatFindInstanceStepOptions(options), { customHeaders: headers })
        );

        return this.parseResponse<InstanceStepsPage>(result);
    }

    private formatFindInstanceStepOptions(
        options?: FindInstanceStepsOptions
    ): CatalyticSDKAPIFindInstanceStepsOptionalParams {
        return {
            query: options?.query,
            pageToken: options?.pageToken,
            pageSize: options?.pageSize,
            participatingUsers: options?.assignedTo,
            processId: options?.workflowID,
            runId: options?.instanceID
        };
    }

    reassignInstanceStep(id: string, newAssigneeEmailAddress: string): Promise<InstanceStep>;
    reassignInstanceStep(
        id: string,
        newAssigneeEmailAddress: string,
        callback: ClientMethodCallback<InstanceStep>
    ): void;
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
        console.log(`Reassigning InstanceStep ${id} to ${newAssigneeEmailAddress}`);

        const body: ReassignStepRequest = {
            id,
            assignTo: newAssigneeEmailAddress
        };
        const result = await this.internalClient.reassignStep(id, WildcardId, {
            customHeaders: this.getRequestHeaders(),
            body
        });

        return this.parseResponse<InstanceStep>(result);
    }

    completeInstanceStep(id: string): Promise<InstanceStep>;
    completeInstanceStep(id: string, fields: FieldInput[]): Promise<InstanceStep>;
    completeInstanceStep(id: string, callback: ClientMethodCallback<InstanceStep>): void;
    completeInstanceStep(id: string, fields: FieldInput[], callback: ClientMethodCallback<InstanceStep>): void;
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
            stepOutputFields: this.formatFields(fields)
        };

        const result = await this.internalClient.completeStep(id, WildcardId, {
            body,
            customHeaders: this.getRequestHeaders()
        });
        return this.parseResponse<InstanceStep>(result);
    }

    private formatFields(fields: FieldInput[]): FieldInput[] {
        if (!fields) {
            return fields;
        }
        if (!Array.isArray(fields)) {
            throw new FieldInputError('Fields must be an Array of FieldInput objects');
        }
        if (fields?.some(f => !f.name && !f.referenceName)) {
            throw new FieldInputError(
                `No name or reference name provided for field at index ${fields.indexOf(
                    fields.find(f => !f.name && !f.referenceName)
                )}`
            );
        }
        return fields?.map(f => ({
            name: f.name || f.referenceName,
            referenceName: f.referenceName || displayNameToInternal(f.name),
            value: f.value
        }));
    }
}

export interface InstanceClientInterface {
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
    get(id: string, callback?: ClientMethodCallback<Instance>): Promise<Instance> | void;

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
    ): Promise<InstancesPage> | void;

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
        name: string | FieldInput[] | ClientMethodCallback<Instance>,
        inputs: FieldInput[] | ClientMethodCallback<Instance>,
        callback?: ClientMethodCallback<Instance>
    ): Promise<Instance> | void;

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
    stop(id: string, callback?: ClientMethodCallback<Instance>): Promise<Instance> | void;

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
    getInstanceStep(id: string, callback?: ClientMethodCallback<InstanceStep>): Promise<InstanceStep> | void;

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
    ): Promise<InstancesPage> | void;

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
    ): Promise<InstanceStep> | void;

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
        fields?: FieldInput[] | ClientMethodCallback<InstanceStep>,
        callback?: ClientMethodCallback<InstanceStep>
    ): Promise<InstanceStep> | void;
}

export interface FindInstancesOptions extends BaseFindOptions {
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

export interface FindInstanceStepsOptions extends BaseFindOptions {
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
    assignedTo?: string;
}
