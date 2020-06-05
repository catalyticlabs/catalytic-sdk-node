import { callbackify } from 'util';

import BaseClient, { FindOptions, ClientMethodCallback } from './BaseClient';
import { Credentials, CredentialsPage } from '../entities';

export default class CredentialsClient extends BaseClient {
    static entity = 'Credentials';

    /**
     * Gets a Credentials by ID
     *
     * @param id The ID of the Credentials to get
     * @returns The Credentials with the provided ID
     */
    get(id: string): Promise<Credentials>;
    /**
     * Gets a Credentials by ID
     *
     * @param id The ID of the Credentials to get
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<Credentials>): void;
    /**
     * Gets a Credentials by ID
     *
     * @param id The ID of the Credentials to get
     * @param callback The optional callback
     * @returns The Credentials with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<Credentials>): Promise<Credentials> {
        if (callback) {
            return callbackify(this._get).call(this, id, callback);
        }

        return this._get(id);
    }

    private async _get(id: string): Promise<Credentials> {
        console.log(`Getting Credentials with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getCredentials(id, { customHeaders: headers });
        return this.parseResponse<Credentials>(result);
    }

    /**
     * Finds Credentials
     *
     * @returns A page of Credentials
     */
    find(): Promise<CredentialsPage>;
    /**
     * Finds Credentials
     *
     * @param options Filter criteria to narrow Credentials returned
     * @returns A page of Credentials
     */
    find(options: FindCredentialsOptions): Promise<CredentialsPage>;
    /**
     * Finds Credentials
     *
     * @param callback The callback
     */
    find(callback: ClientMethodCallback<CredentialsPage>): void;
    /**
     * Finds Credentials
     *
     * @param options Filter criteria to narrow Credentials returned
     * @param callback The callback
     */
    find(options: FindCredentialsOptions, callback: ClientMethodCallback<CredentialsPage>): void;
    /**
     * Finds Credentials
     *
     * @param options Filter criteria to narrow Credentials returned
     * @param callback The callback
     * @returns A page of Credentials
     */
    find(
        options?: FindCredentialsOptions | ClientMethodCallback<CredentialsPage>,
        callback?: ClientMethodCallback<CredentialsPage>
    ): Promise<CredentialsPage> {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return callbackify(this._find).call(this, options, callback);
        }

        return this._find(options as FindCredentialsOptions);
    }

    private async _find(options?: FindCredentialsOptions): Promise<CredentialsPage> {
        console.log('Finding Credentials');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findCredentials(
            Object.assign({}, options, { customHeaders: headers })
        );
        return this.parseResponse<CredentialsPage>(result);
    }

    // async create(domain: string): Promise<Credentials> {
    //     console.log(`Creating Credentials on domain '${domain}'`);
    //     const result = await this.internalClient.createCredentials({ domain });
    //     return this.parseResponse<Credentials>(result);
    // }
}

export interface FindCredentialsOptions extends FindOptions {
    /**
     * The email address of the Credentials' owner
     */
    owner?: string;
}
