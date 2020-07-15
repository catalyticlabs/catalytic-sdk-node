import { AccessToken, AccessTokensPage } from '../entities';
import {
    AccessTokenCreationWithEmailAndPasswordRequest,
    AccessTokenCreationRequest,
    WaitForAccessTokenApprovalRequest
} from '../internal/lib/models';
import { BaseFindOptions, ClientMethodCallback } from '../types';
import * as utils from '../utils';

import BaseClient from './BaseClient';

export default class AccessTokenClient extends BaseClient implements AccessTokenClientInterface {
    static entity = 'AccessToken';

    get(id: string): Promise<AccessToken>;
    get(id: string, callback: ClientMethodCallback<AccessToken>): void;
    get(id: string, callback?: ClientMethodCallback<AccessToken>): Promise<AccessToken> | void {
        this.log(`Getting AccessToken with ID '${id}'`);
        if (callback) {
            return this.callbackifyBound(this._get)(id, callback);
        }

        return this._get(id);
    }

    private async _get(id: string): Promise<AccessToken> {
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
        this.log('Finding AccessToken');
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
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.findAccessTokens(
            Object.assign({}, options, { customHeaders: headers })
        );
        return this.parseResponse<AccessTokensPage>(result);
    }

    create(teamName: string, email: string, password: string): Promise<AccessToken>;
    create(teamName: string, email: string, password: string, accessTokenName: string): Promise<AccessToken>;
    create(teamName: string, email: string, password: string, callback: ClientMethodCallback<AccessToken>): void;
    create(
        teamName: string,
        email: string,
        password: string,
        accessTokenName: string,
        callback: ClientMethodCallback<AccessToken>
    ): void;
    create(
        teamName: string,
        email: string,
        password: string,
        accessTokenName: string | ClientMethodCallback<AccessToken> = null,
        callback?: ClientMethodCallback<AccessToken>
    ): Promise<AccessToken> | void {
        if (typeof accessTokenName === 'function') {
            callback = accessTokenName;
            accessTokenName = null;
        }

        if (callback) {
            return this.callbackifyBound(this._createWithEmailAndPassword)(
                teamName,
                email,
                password,
                accessTokenName as string,
                callback
            );
        }

        return this._createWithEmailAndPassword(teamName, email, password, accessTokenName as string);
    }
    private async _createWithEmailAndPassword(
        teamNameOrDomain: string,
        email: string,
        password: string,
        name: string
    ): Promise<AccessToken> {
        const domain = utils.getDomainFromTeamName(teamNameOrDomain);
        this.log(`Creating AccessToken in '${domain}' for user '${email}'`);

        const body: AccessTokenCreationWithEmailAndPasswordRequest = { domain, email, password, name };
        const result = await this._internalClient.createAndApproveAccessToken({ body });
        return this.parseResponse<AccessToken>(result);
    }

    createWithWebApprovalFlow(teamName: string): Promise<AccessToken>;
    createWithWebApprovalFlow(teamName: string, accessTokenName: string): Promise<AccessToken>;
    createWithWebApprovalFlow(teamName: string, callback: ClientMethodCallback<AccessToken>): void;
    createWithWebApprovalFlow(
        teamName: string,
        accessTokenName: string,
        callback: ClientMethodCallback<AccessToken>
    ): void;
    createWithWebApprovalFlow(
        teamName: string,
        accessTokenName: string | ClientMethodCallback<AccessToken> = null,
        callback?: ClientMethodCallback<AccessToken>
    ): Promise<AccessToken> | void {
        if (typeof accessTokenName === 'function') {
            callback = accessTokenName;
            accessTokenName = null;
        }

        if (callback) {
            return this.callbackifyBound(this._createWithWebApprovalFlow)(
                teamName,
                accessTokenName as string,
                callback
            );
        }

        return this._createWithWebApprovalFlow(teamName, accessTokenName as string);
    }

    private async _createWithWebApprovalFlow(teamNameOrDomain: string, name: string): Promise<AccessToken> {
        const domain = utils.getDomainFromTeamName(teamNameOrDomain);
        this.log(`Creating AccessToken in '${domain}'`);

        const creationBody: AccessTokenCreationRequest = { domain, name };
        const result = await this._internalClient.createAccessToken({ body: creationBody });
        return this.parseResponse<AccessToken>(result);
    }

    waitForApproval(accessToken: AccessToken): Promise<void>;
    waitForApproval(accessToken: AccessToken, waitTimeMillis: number): Promise<void>;
    waitForApproval(accessToken: AccessToken, callback: ClientMethodCallback<void>): void;
    waitForApproval(accessToken: AccessToken, waitTimeMillis: number, callback: ClientMethodCallback<void>): void;
    waitForApproval(
        accessToken: AccessToken,
        waitTimeMillis: number | ClientMethodCallback<void> = null,
        callback?: ClientMethodCallback<void>
    ): Promise<void> | void {
        if (typeof waitTimeMillis === 'function') {
            callback = waitTimeMillis;
            waitTimeMillis = null;
        }

        if (callback) {
            return this.callbackifyBound(this._waitForApproval)(accessToken, waitTimeMillis as number, callback);
        }

        return this._waitForApproval(accessToken, waitTimeMillis as number);
    }

    private async _waitForApproval(accessToken: AccessToken, waitTimeMillis: number): Promise<void> {
        this.log(`Waiting for approval of AccessToken '${accessToken.id}'`);

        const pollBody: WaitForAccessTokenApprovalRequest = { token: accessToken.token, waitTimeMillis };
        const result = await this._internalClient.waitForAccessTokenApproval({ body: pollBody });
        this.parseResponse<object>(result);
    }

    revoke(id: string): Promise<AccessToken>;
    revoke(id: string, callback: ClientMethodCallback<AccessToken>): void;
    revoke(id: string, callback?: ClientMethodCallback<AccessToken>): Promise<AccessToken> | void {
        if (callback) {
            return this.callbackifyBound(this._revoke)(id, callback);
        }

        return this._revoke(id);
    }

    private async _revoke(id: string): Promise<AccessToken> {
        this.log(`Revoking AccessToken with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.revokeAccessToken(id, { customHeaders: headers });
        return this.parseResponse<AccessToken>(result);
    }

    getApprovalUrl(accessToken: AccessToken, applicationName?: string): string {
        if (!applicationName) {
            applicationName = 'Catalytic SDK';
        }
        return `https://${accessToken.domain}/access-tokens/approve?userTokenID=${
            accessToken.id
        }&application=${encodeURIComponent(applicationName)}`;
    }

    openUrl(url: string): void {
        utils.openUrl(url);
    }
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

    /**
     * @summary Create a new Access Token for a Catalytic user
     *
     * @param teamName The name or domain of the Catalytic team to which the user belongs (ex: "myteam" or "myteam.pushbot.com")
     * @param email The email of the Catalytic user for which Access Token should be created
     * @param password The password of the Catalytic user for which Access Token should be created
     * @returns The created AccessToken
     */
    create(teamName: string, email: string, password: string): Promise<AccessToken>;
    /**
     * @summary Create a new Access Token for a Catalytic user
     *
     * @param teamName The name or domain of the Catalytic team to which the user belongs (ex: "myteam" or "myteam.pushbot.com")
     * @param email The email of the Catalytic user for which Access Token should be created
     * @param password The password of the Catalytic user for which Access Token should be created
     * @param accessTokenName Name to assign to Access Token; visible in Catalytic UI
     * @returns The created AccessToken
     */
    create(teamName: string, email: string, password: string, accessTokenName: string): Promise<AccessToken>;
    /**
     * @summary Create a new Access Token for a Catalytic user
     *
     * @param teamName The name or domain of the Catalytic team to which the user belongs (ex: "myteam" or "myteam.pushbot.com")
     * @param email The email of the Catalytic user for which Access Token should be created
     * @param password The password of the Catalytic user for which Access Token should be created
     * @param callback The callback
     */
    create(teamName: string, email: string, password: string, callback: ClientMethodCallback<AccessToken>): void;
    /**
     * @summary Create a new Access Token for a Catalytic user
     *
     * @param teamName The name or domain of the Catalytic team to which the user belongs (ex: "myteam" or "myteam.pushbot.com")
     * @param email The email of the Catalytic user for which Access Token should be created
     * @param password The password of the Catalytic user for which Access Token should be created
     * @param accessTokenName Name to assign to Access Token; visible in Catalytic UI
     * @param callback The callback
     */
    create(
        teamName: string,
        email: string,
        password: string,
        accessTokenName: string,
        callback: ClientMethodCallback<AccessToken>
    ): void;

    /**
     * @summary Create a new Access Token for a Catalytic user
     *
     * @param teamName The name or domain of the Catalytic team to which the user belongs (ex: "myteam" or "myteam.pushbot.com")
     * @param email The email of the Catalytic user for which Access Token should be created
     * @param password The password of the Catalytic user for which Access Token should be created
     * @param accessTokenName Name to assign to Access Token; visible in Catalytic UI
     * @param callback The callback
     * @returns The created AccessToken
     */
    create(
        teamName: string,
        email: string,
        password: string,
        accessTokenName?: string | ClientMethodCallback<AccessToken>,
        callback?: ClientMethodCallback<AccessToken>
    ): Promise<AccessToken> | void;

    /**
     * @summary Create a new Access Token for a Catalytic user, requiring approval via Catalytic WebApp
     *
     * @param teamName The name or domain of the Catalytic team to which the user belongs (ex: "myteam" or "myteam.pushbot.com")
     * @returns The created AccessToken, requiring approval via Catalytic WebApp
     */
    createWithWebApprovalFlow(teamName: string): Promise<AccessToken>;
    /**
     * @summary Create a new Access Token for a Catalytic user, requiring approval via Catalytic WebApp
     *
     * @param teamName The name or domain of the Catalytic team to which the user belongs (ex: "myteam" or "myteam.pushbot.com")
     * @param accessTokenName Name to assign to Access Token; visible in Catalytic UI
     * @returns The created AccessToken, requiring approval via Catalytic WebApp
     */
    createWithWebApprovalFlow(teamName: string, accessTokenName: string): Promise<AccessToken>;
    /**
     * @summary Create a new Access Token for a Catalytic user, requiring approval via Catalytic WebApp
     *
     * @param teamName The name or domain of the Catalytic team to which the user belongs (ex: "myteam" or "myteam.pushbot.com")
     * @param callback The callback
     */
    createWithWebApprovalFlow(teamName: string, callback: ClientMethodCallback<AccessToken>): void;
    /**
     * @summary Create a new Access Token for a Catalytic user, requiring approval via Catalytic WebApp
     *
     * @param teamName The name or domain of the Catalytic team to which the user belongs (ex: "myteam" or "myteam.pushbot.com")
     * @param accessTokenName Name to assign to Access Token; visible in Catalytic UI
     * @param callback The callback
     */
    createWithWebApprovalFlow(
        teamName: string,
        accessTokenName: string,
        callback: ClientMethodCallback<AccessToken>
    ): void;

    /**
     * @summary Create a new Access Token for a Catalytic user, requiring approval via Catalytic WebApp
     *
     * @param teamName The name or domain of the Catalytic team to which the user belongs (ex: "myteam" or "myteam.pushbot.com")
     * @param accessTokenName Name to assign to Access Token; visible in Catalytic UI
     * @param callback The callback
     * @returns The created AccessToken, requiring approval via Catalytic WebApp
     */
    createWithWebApprovalFlow(
        teamName: string,
        accessTokenName?: string | ClientMethodCallback<AccessToken>,
        callback?: ClientMethodCallback<AccessToken>
    ): Promise<AccessToken> | void;

    /**
     * @summary Wait for Access Token to be approved via the Catalytic UI
     *
     * @param accessToken The AccessToken to wait for
     */
    waitForApproval(accessToken: AccessToken): Promise<void>;
    /**
     * @summary Wait for Access Token to be approved via the Catalytic UI
     *
     * @param accessToken The AccessToken to wait for
     * @param waitTimeMillis Duration to wait for Access Token to be approved
     */
    waitForApproval(accessToken: AccessToken, waitTimeMillis: number): Promise<void>;
    /**
     * @summary Wait for Access Token to be approved via the Catalytic UI
     *
     * @param accessToken The AccessToken to wait for
     * @param callback The callback
     */
    waitForApproval(accessToken: AccessToken, callback: ClientMethodCallback<void>): void;
    /**
     * @summary Wait for Access Token to be approved via the Catalytic UI
     *
     * @param accessToken The AccessToken to wait for
     * @param waitTimeMillis Duration to wait for Access Token to be approved
     * @param callback The callback
     */
    waitForApproval(accessToken: AccessToken, waitTimeMillis: number, callback: ClientMethodCallback<void>): void;
    /**
     * @summary Wait for Access Token to be approved via the Catalytic UI
     *
     * @param accessToken The AccessToken to wait for
     * @param waitTimeMillis Duration to wait for Access Token to be approved
     * @param callback The callback
     */
    waitForApproval(
        accessToken: AccessToken,
        waitTimeMillis?: number | ClientMethodCallback<void>,
        callback?: ClientMethodCallback<void>
    ): Promise<void> | void;

    /**
     * @summary Permanently revoke an Access Token, preventing future use
     *
     * @param id The ID of the Access Token to revoke
     * @returns The revoked Access Token
     */
    revoke(id: string): Promise<AccessToken>;
    /**
     * @summary Permanently revoke an Access Token, preventing future use
     *
     * @param id The ID of the Access Token to revoke
     * @param callback The callback called with the revoked Access Token
     */
    revoke(id: string, callback: ClientMethodCallback<AccessToken>): void;
    /**
     * @summary Permanently revoke an Access Token, preventing future use
     *
     * @param id The ID of the Access Token to revoke
     * @param callback The callback called with the revoked Access Token
     * @returns The revoked Access Token
     */
    revoke(id: string, callback?: ClientMethodCallback<AccessToken>): Promise<AccessToken> | void;

    /**
     * @summary Get the URL at which the Access Token can be approved
     * @param accessToken The Access Token for which the URL should be generated
     * @param applicationName Custom application name requesting the Access Token
     */
    getApprovalUrl(accessToken: AccessToken, applicationName?: string): string;

    /**
     * @summary Opens a URL in the user's default browser
     *
     * @param url The url to open
     */
    openUrl(url: string): void;
}

export interface FindAccessTokensOptions extends BaseFindOptions {
    /**
     * @summary The email address of the AccessToken' owner
     */
    owner?: string;
}
