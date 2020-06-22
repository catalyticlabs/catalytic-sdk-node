import { AccessToken, AccessTokensPage } from '../entities';
import { BaseFindOptions, ClientMethodCallback } from '../types';

import BaseClient from './BaseClient';

export default class AccessTokenClient extends BaseClient implements AccessTokenClientInterface {
    static entity = 'AccessToken';

    get(id: string): Promise<AccessToken>;
    get(id: string, callback: ClientMethodCallback<AccessToken>): void;
    get(id: string, callback?: ClientMethodCallback<AccessToken>): Promise<AccessToken> | void {
        if (callback) {
            return this.callbackifyBound(this._get)(id, callback);
        }

        return this._get(id);
    }

    private async _get(id: string): Promise<AccessToken> {
        console.log(`Getting AccessToken with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.getAccessToken(id, { customHeaders: headers });
        return this.parseResponse<AccessToken>(result);
    }

    find(): Promise<AccessTokensPage>;
    find(options: FindAccessTokensOptions): Promise<AccessTokensPage>;
    find(callback: ClientMethodCallback<AccessTokensPage>): void;
    find(options: FindAccessTokensOptions, callback: ClientMethodCallback<AccessTokensPage>): void;
    find(
        options?: FindAccessTokensOptions | ClientMethodCallback<AccessTokensPage>,
        callback?: ClientMethodCallback<AccessTokensPage>
    ): Promise<AccessTokensPage> | void {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return this.callbackifyBound(this._find)(options as FindAccessTokensOptions, callback);
        }

        return this._find(options as FindAccessTokensOptions);
    }

    private async _find(options: FindAccessTokensOptions): Promise<AccessTokensPage> {
        console.log('Finding AccessToken');
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.findAccessTokens(
            Object.assign({}, options, { customHeaders: headers })
        );
        return this.parseResponse<AccessTokensPage>(result);
    }

    // async create(domain: string): Promise<AccessToken> {
    //     console.log(`Creating AccessToken on domain '${domain}'`);
    //     const result = await this._internalClient.createAccessToken({ domain });
    //     return this.parseResponse<AccessToken>(result);
    // }
}

export interface AccessTokenClientInterface {
    /**
     * @summary Gets a AccessToken by ID
     *
     * @param id The ID of the AccessToken to get
     * @returns The AccessToken with the provided ID
     */
    get(id: string): Promise<AccessToken>;
    /**
     * @summary Gets a AccessToken by ID
     *
     * @param id The ID of the AccessToken to get
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<AccessToken>): void;
    /**
     * @summary Gets a AccessToken by ID
     *
     * @param id The ID of the AccessToken to get
     * @param callback The optional callback
     * @returns The AccessToken with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<AccessToken>): Promise<AccessToken> | void;

    /**
     * @summary Finds AccessToken
     *
     * @returns A page of AccessToken
     */
    find(): Promise<AccessTokensPage>;
    /**
     * @summary Finds AccessToken
     *
     * @param options Filter criteria to narrow AccessToken returned
     * @returns A page of AccessToken
     */
    find(options: FindAccessTokensOptions): Promise<AccessTokensPage>;
    /**
     * @summary Finds AccessToken
     *
     * @param callback The callback
     */
    find(callback: ClientMethodCallback<AccessTokensPage>): void;
    /**
     * @summary Finds AccessToken
     *
     * @param options Filter criteria to narrow AccessToken returned
     * @param callback The callback
     */
    find(options: FindAccessTokensOptions, callback: ClientMethodCallback<AccessTokensPage>): void;
    /**
     * @summary Finds AccessToken
     *
     * @param options Filter criteria to narrow AccessToken returned
     * @param callback The callback
     * @returns A page of AccessToken
     */
    find(
        options?: FindAccessTokensOptions | ClientMethodCallback<AccessTokensPage>,
        callback?: ClientMethodCallback<AccessTokensPage>
    ): Promise<AccessTokensPage> | void;
}

export interface FindAccessTokensOptions extends BaseFindOptions {
    /**
     * @summary The email address of the AccessToken' owner
     */
    owner?: string;
}
