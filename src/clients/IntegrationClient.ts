import {
    Integration,
    IntegrationsPage,
    IntegrationCreationRequest,
    IntegrationConfiguration,
    IntegrationUpdateRequest,
    IntegrationConnection
} from '../entities';
import { BaseFindOptions, ClientMethodCallback, FieldInput } from '../types';

import BaseClient from './BaseClient';
import { findMatchingField } from '../utils';

export default class IntegrationClient extends BaseClient implements IntegrationClientInterface {
    static entity = 'Integration';

    get(id: string): Promise<Integration>;
    get(id: string, callback: ClientMethodCallback<Integration>): void;
    get(id: string, callback?: ClientMethodCallback<Integration>): Promise<Integration> | void {
        this.log(`Getting Integration with ID '${id}'`);
        if (callback) {
            return this.callbackifyBound(this._get)(id, callback);
        }

        return this._get(id);
    }

    private async _get(id: string): Promise<Integration> {
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.getIntegration(id, { customHeaders: headers });
        return this.parseResponse<Integration>(result);
    }

    find(): Promise<IntegrationsPage>;
    find(options: FindIntegrationsOptions): Promise<IntegrationsPage>;
    find(callback: ClientMethodCallback<IntegrationsPage>): void;
    find(options: FindIntegrationsOptions, callback: ClientMethodCallback<IntegrationsPage>): void;
    find(
        options?: FindIntegrationsOptions | ClientMethodCallback<IntegrationsPage>,
        callback?: ClientMethodCallback<IntegrationsPage>
    ): Promise<IntegrationsPage> | void {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return this.callbackifyBound(this._find)(options as FindIntegrationsOptions, callback);
        }

        return this._find(options as FindIntegrationsOptions);
    }
    private async _find(options: FindIntegrationsOptions): Promise<IntegrationsPage> {
        this.log('Finding Integrations');
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.findIntegrations(
            Object.assign({}, options, { customHeaders: headers })
        );
        return this.parseResponse<IntegrationsPage>(result);
    }

    create(createRequest: IntegrationCreationRequest): Promise<Integration>;
    create(name: string, config: IntegrationConfiguration): Promise<Integration>;
    create(
        createRequest: IntegrationCreationRequest,
        callback: ClientMethodCallback<Integration>
    ): Promise<Integration>;
    create(
        name: string,
        config: IntegrationConfiguration,
        callback: ClientMethodCallback<Integration>
    ): Promise<Integration>;
    create(
        requestOrName: string | IntegrationCreationRequest,
        configOrCallback?: IntegrationConfiguration | ClientMethodCallback<Integration>,
        callback?: ClientMethodCallback<Integration>
    ): Promise<Integration> | void {
        let request: IntegrationCreationRequest;
        if (typeof configOrCallback === 'function') {
            callback = configOrCallback;
            configOrCallback = null;
        }
        if (typeof requestOrName === 'string') {
            request = new IntegrationCreationRequest();
            request.name = requestOrName;
            request.config = configOrCallback as IntegrationConfiguration;
        } else {
            request = requestOrName;
        }

        if (callback) {
            return this.callbackifyBound(this._create)(request, callback);
        }

        return this._create(request);
    }
    private async _create(creationRequest: IntegrationCreationRequest): Promise<Integration> {
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.createIntegration(
            Object.assign({}, creationRequest, { customHeaders: headers })
        );
        return this.parseResponse<Integration>(result);
    }

    update(id: string, updateRequest: IntegrationUpdateRequest): Promise<Integration>;
    update(id: string, name: string, config: IntegrationConfiguration): Promise<Integration>;
    update(id: string, updateRequest: IntegrationUpdateRequest, callback: ClientMethodCallback<Integration>): void;
    update(
        id: string,
        name: string,
        config: IntegrationConfiguration,
        callback: ClientMethodCallback<Integration>
    ): void;
    update(
        id: string,
        requestOrName: IntegrationUpdateRequest | string,
        configOrCallback?: IntegrationConfiguration | ClientMethodCallback<Integration>,
        callback?: ClientMethodCallback<Integration>
    ): Promise<Integration> | void {
        let request: IntegrationUpdateRequest;
        if (typeof configOrCallback === 'function') {
            callback = configOrCallback;
            configOrCallback = null;
        }
        if (typeof requestOrName === 'string') {
            request = new IntegrationUpdateRequest();
            request.name = requestOrName;
            request.config = configOrCallback as IntegrationConfiguration;
        } else {
            request = requestOrName;
        }

        if (callback) {
            return this.callbackifyBound(this._update)(id, request, callback);
        }

        return this._update(id, request);
    }
    private async _update(id: string, updateRequest: IntegrationUpdateRequest): Promise<Integration> {
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.updateIntegration(
            id,
            Object.assign({}, updateRequest, { customHeaders: headers })
        );
        return this.parseResponse<Integration>(result);
    }

    delete(id: string): Promise<void>;
    delete(id: string, callback: ClientMethodCallback<void>): void;
    delete(id: string, callback?: ClientMethodCallback<void>): Promise<void> | void {
        if (callback) {
            return this.callbackifyBound(this._delete)(id, callback);
        }

        return this._delete(id);
    }
    private async _delete(id: string): Promise<void> {
        const headers = this.getRequestHeaders();

        const result = await this._internalClient.deleteIntegration(id, { customHeaders: headers });
        this.parseResponse(result);
    }

    getConnection(id: string): Promise<IntegrationConnection>;
    getConnection(id: string, callback: ClientMethodCallback<IntegrationConnection>): void;
    getConnection(
        id: string,
        callback?: ClientMethodCallback<IntegrationConnection>
    ): Promise<IntegrationConnection> | void {
        this.log(`Fetching Integration Connection with id '${id}'`);
        if (typeof callback == 'function') {
            return this.callbackifyBound(this._getConnection)(id, callback);
        }

        return this._getConnection(id);
    }

    private async _getConnection(id: string): Promise<IntegrationConnection> {
        const headers = this.getRequestHeaders();

        const result = await this._internalClient.getIntegrationConnection('-', id, { customHeaders: headers });
        return this.parseResponse<IntegrationConnection>(result, 'Integration Connection');
    }

    createConnection(
        integrationId: string,
        name: string,
        connectionParams: FieldInput[]
    ): Promise<IntegrationConnection>;
    createConnection(
        integrationId: string,
        name: string,
        connectionParams: FieldInput[],
        callback: ClientMethodCallback<IntegrationConnection>
    ): void;
    createConnection(
        integrationId: string,
        name: string,
        connectionParams: FieldInput[],
        callback?: ClientMethodCallback<IntegrationConnection>
    ): Promise<IntegrationConnection> | void {
        this.log(`Creating new Connection of Integration '${integrationId}' with name '${name}'`);

        if (typeof callback === 'function') {
            return this.callbackifyBound(this._createConnection)(integrationId, name, connectionParams, callback);
        }

        return this._createConnection(integrationId, name, connectionParams);
    }

    private async _createConnection(
        integrationId: string,
        name: string,
        connectionParams: FieldInput[]
    ): Promise<IntegrationConnection> {
        const headers = this.getRequestHeaders();
        const integration = await this.get(integrationId);

        const body = { integrationId, name, connectionParams: [] };

        connectionParams.forEach(input => {
            const matchingField = findMatchingField(input, integration.connectionParams);
            body.connectionParams.push({
                name: matchingField.name,
                referenceName: matchingField.referenceName,
                value: input.value
            });
        });

        const result = await this._internalClient.createIntegrationConnection(integrationId, {
            body,
            customHeaders: headers
        });
        return this.parseResponse<IntegrationConnection>(result, 'Integration Connection');
    }

    deleteConnection(id: string): Promise<void>;
    deleteConnection(id: string, callback: ClientMethodCallback<void>): void;
    deleteConnection(id: string, callback?: ClientMethodCallback<void>): Promise<void> | void {
        this.log(`Deleting Integration Connection with id '${id}'`);
        if (typeof callback == 'function') {
            return this.callbackifyBound(this._deleteConnection)(id, callback);
        }

        return this._deleteConnection(id);
    }

    private async _deleteConnection(id: string): Promise<void> {
        const headers = this.getRequestHeaders();

        const result = await this._internalClient.deleteIntegrationConnection('-', id, { customHeaders: headers });
        this.parseResponse(result, 'Integration Connection');
    }
}

export interface IntegrationClientInterface {
    /**
     * @summary Gets a Integration by ID
     *
     * @param id The ID of the Integration to get
     * @returns The Integration with the provided ID
     */
    get(id: string): Promise<Integration>;
    /**
     * @summary Gets a Integration by ID
     *
     * @param id The ID of the Integration to get
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<Integration>): void;
    /**
     * @summary Gets a Integration by ID
     *
     * @param id The ID of the Integration to get
     * @param callback The optional callback
     * @returns The Integration with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<Integration>): Promise<Integration> | void;

    /**
     * @summary Finds Integrations
     *
     * @returns A page of Integrations
     */
    find(): Promise<IntegrationsPage>;
    /**
     * @summary Finds Integrations
     *
     * @param options Filter criteria to narrow Integrations returned
     * @returns A page of Integrations
     */
    find(options: FindIntegrationsOptions): Promise<IntegrationsPage>;
    /**
     * @summary Finds Integrations
     *
     * @param callback The callback
     */
    find(callback: ClientMethodCallback<IntegrationsPage>): void;
    /**
     * @summary Finds Integrations
     *
     * @param options Filter criteria to narrow Integrations returned
     * @param callback The callback
     */
    find(options: FindIntegrationsOptions, callback: ClientMethodCallback<IntegrationsPage>): void;
    /**
     * @summary Finds Integrations
     *
     * @param options Filter criteria to narrow Integrations returned
     * @param callback The callback
     * @returns A page of Integrations
     */
    find(
        options?: FindIntegrationsOptions | ClientMethodCallback<IntegrationsPage>,
        callback?: ClientMethodCallback<IntegrationsPage>
    ): Promise<IntegrationsPage> | void;

    /**
     * @summary Create a new custom Integration
     *
     * @param createRequest Request containing information about the custom Integration to create
     * @returns The newly created Integration
     */
    create(createRequest: IntegrationCreationRequest): Promise<Integration>;
    /**
     * @summary Create a new custom Integration
     *
     * @param name The name to apply to the new Integration
     * @param config Configuration settings for creating Connections with the Integration
     * @returns The newly created Integration
     */
    create(name: string, config: IntegrationConfiguration): Promise<Integration>;
    /**
     * @summary Create a new custom Integration
     *
     * @param createRequest Request containing information about the custom Integration to create
     * @param callback The callback
     */
    create(
        createRequest: IntegrationCreationRequest,
        callback: ClientMethodCallback<Integration>
    ): Promise<Integration>;
    /**
     * @summary Create a new custom Integration
     *
     * @param name The name to apply to the new Integration
     * @param config Configuration settings for creating Connections with the Integration
     * @param callback The callback
     */
    create(
        name: string,
        config: IntegrationConfiguration,
        callback: ClientMethodCallback<Integration>
    ): Promise<Integration>;
    /**
     * @summary Create a new custom Integration
     *
     * @param requestOrName The request containing information about the custom Integration or the name to apply to the new Integration
     * @param configOrCallback The configuration settings for creating Connections with the Integration or the callback
     * @param callback The optional callback
     * @returns The newly created Integration
     */
    create(
        requestOrName: string | IntegrationCreationRequest,
        configOrCallback?: IntegrationConfiguration | ClientMethodCallback<Integration>,
        callback?: ClientMethodCallback<Integration>
    ): Promise<Integration> | void;

    /**
     * @summary Update an existing custom Integration
     *
     * @param id The ID of the custom Integration to update
     * @param updateRequest Request containing information about the custom Integration to update
     * @returns The updated Integration
     */
    update(id: string, updateRequest: IntegrationUpdateRequest): Promise<Integration>;
    /**
     * @summary Update an existing custom Integration
     *
     * @param id The ID of the custom Integration to update
     * @param name The name to apply to the updated Integration
     * @param config The configuration settings for creating Connections with the Integration
     * @returns The updated Integration
     */
    update(id: string, name: string, config: IntegrationConfiguration): Promise<Integration>;
    /**
     * @summary Update an existing custom Integration
     *
     * @param id The ID of the custom Integration to update
     * @param updateRequest Request containing information about the custom Integration to update
     * @param callback The callback
     */
    update(id: string, updateRequest: IntegrationUpdateRequest, callback: ClientMethodCallback<Integration>): void;
    /**
     * @summary Update an existing custom Integration
     *
     * @param id The ID of the custom Integration to update
     * @param name The name to apply to the updated Integration
     * @param config The configuration settings for creating Connections with the Integration
     * @param callback The callback
     */
    update(
        id: string,
        name: string,
        config: IntegrationConfiguration,
        callback: ClientMethodCallback<Integration>
    ): void;
    /**
     * @summary Update an existing custom Integration
     *
     * @param id The ID of the Integration to update
     * @param requestOrName The request containing information about the custom Integration or the name to apply to the updated Integration
     * @param configOrCallback The configuration settings for creating Connections with the Integration or the callback
     * @param callback The optional callback
     * @returns The updated Integration
     */
    update(
        id: string,
        requestOrName: IntegrationUpdateRequest | string,
        configOrCallback?: IntegrationConfiguration | ClientMethodCallback<Integration>,
        callback?: ClientMethodCallback<Integration>
    ): Promise<Integration> | void;

    /**
     * @summary Delete an existing custom Integration
     *
     * @param id The ID of the Integration to delete
     */
    delete(id: string): Promise<void>;
    /**
     * @summary Delete an existing custom Integration
     *
     * @param id The ID of the Integration to delete
     * @param callback The callback
     */
    delete(id: string, callback: ClientMethodCallback<void>): void;
    /**
     * @summary Delete an existing custom Integration
     *
     * @param id The ID of the Integration to delete
     * @param callback The optional callback
     */
    delete(id: string, callback?: ClientMethodCallback<void>): Promise<void> | void;

    /**
     * Fetch an Integration Connection by ID
     * @param id The ID of the Integration Connection to fetch
     * @returns The Integration Connection with the provided ID
     */
    getConnection(id: string): Promise<IntegrationConnection>;
    /**
     * Fetch an Integration Connection by ID
     * @param id The ID of the Integration Connection to fetch
     * @param callback The callback
     */
    getConnection(id: string, callback: ClientMethodCallback<IntegrationConnection>): void;
    /**
     * Fetch an Integration Connection by ID
     * @param id The ID of the Integration Connection to fetch
     * @param callback The optional callback
     * @returns The Integration Connection with the provided ID
     */
    getConnection(
        id: string,
        callback?: ClientMethodCallback<IntegrationConnection>
    ): Promise<IntegrationConnection> | void;

    /**
     * Create a new Integration Connection
     *
     * @param integrationId The ID of the Integration with which a Connection will be created
     * @param name The display Name to apply to the newly created Integration Connection
     * @param connectionParams Authentication parameters required to create a Connection to the Integration
     * @returns The created Integration Connection
     */
    createConnection(
        integrationId: string,
        name: string,
        connectionParams: FieldInput[]
    ): Promise<IntegrationConnection>;
    createConnection(
        integrationId: string,
        name: string,
        connectionParams: FieldInput[],
        callback: ClientMethodCallback<IntegrationConnection>
    ): void;
    createConnection(
        integrationId: string,
        name: string,
        connectionParams: FieldInput[],
        callback?: ClientMethodCallback<IntegrationConnection>
    ): Promise<IntegrationConnection> | void;

    deleteConnection(id: string): Promise<void>;
    deleteConnection(id: string, callback: ClientMethodCallback<void>): void;
    deleteConnection(id: string, callback?: ClientMethodCallback<void>): Promise<void> | void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindIntegrationsOptions extends BaseFindOptions {}
