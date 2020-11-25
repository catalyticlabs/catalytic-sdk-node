import { User, UsersPage } from '../entities';
import { BaseFindOptions, BaseSearchOptions, ClientMethodCallback } from '../types';

import BaseClient from './BaseClient';

export default class UserClient extends BaseClient implements UserClientInterface {
    static entity = 'User';

    get(id: string): Promise<User>;
    get(id: string, callback: ClientMethodCallback<User>): void;
    get(id: string, callback?: ClientMethodCallback<User>): Promise<User> | void {
        if (callback) {
            return this.callbackifyBound(this._get)(id, callback);
        }

        return this._get(id);
    }

    private async _get(id: string): Promise<User> {
        this.log(`Getting User with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.getUser(id, { customHeaders: headers });
        return this.parseResponse<User>(result);
    }

    find(): Promise<UsersPage>;
    find(options: FindUsersOptions): Promise<UsersPage>;
    find(callback: ClientMethodCallback<UsersPage>): void;
    find(options: FindUsersOptions, callback: ClientMethodCallback<UsersPage>): void;
    find(
        options?: FindUsersOptions | ClientMethodCallback<UsersPage>,
        callback?: ClientMethodCallback<UsersPage>
    ): Promise<UsersPage> | void {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return this.callbackifyBound(this._find)(options as FindUsersOptions, callback);
        }

        return this._find(options as FindUsersOptions);
    }
    private async _find(options: FindUsersOptions): Promise<UsersPage> {
        process.emitWarning('Users.find() method has been deprecated. Use Users.search() method instead.');
        this.log('Finding Users');
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.findUsers(Object.assign({}, options, { customHeaders: headers }));
        return this.parseResponse<UsersPage>(result);
    }

    search(): Promise<UsersPage>;
    search(options: SearchUsersOptions): Promise<UsersPage>;
    search(callback: ClientMethodCallback<UsersPage>): void;
    search(options: SearchUsersOptions, callback: ClientMethodCallback<UsersPage>): void;
    search(
        options?: SearchUsersOptions | ClientMethodCallback<UsersPage>,
        callback?: ClientMethodCallback<UsersPage>
    ): Promise<UsersPage> | void {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return this.callbackifyBound(this._search)(options as SearchUsersOptions, callback);
        }

        return this._search(options as SearchUsersOptions);
    }

    private async _search(options: SearchUsersOptions): Promise<UsersPage> {
        this.log('Searching Users');
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.searchUsers(Object.assign({}, options, { customHeaders: headers }));
        return this.parseResponse<UsersPage>(result);
    }
}

export interface UserClientInterface {
    /**
     * @summary Gets a User by ID
     *
     * @param id The ID of the User to get
     * @returns The User with the provided ID
     */
    get(id: string): Promise<User>;
    /**
     * @summary Gets a User by ID
     *
     * @param id The ID of the User to get
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<User>): void;
    /**
     * @summary Gets a User by ID
     *
     * @param id The ID of the User to get
     * @param callback The optional callback
     * @returns The User with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<User>): Promise<User> | void;

    /**
     * @summary Finds Users
     *
     * @returns A page of Users
     */
    find(): Promise<UsersPage>;
    /**
     * @summary Finds Users
     *
     * @param options Filter criteria to narrow Users returned
     * @returns A page of Users
     */
    find(options: FindUsersOptions): Promise<UsersPage>;
    /**
     * @summary Finds Users
     *
     * @param callback The callback
     */
    find(callback: ClientMethodCallback<UsersPage>): void;
    /**
     * @summary Finds Users
     *
     * @param options Filter criteria to narrow Users returned
     * @param callback The callback
     */
    find(options: FindUsersOptions, callback: ClientMethodCallback<UsersPage>): void;
    /**
     * @summary Finds Users
     *
     * @param options Filter criteria to narrow Users returned
     * @param callback The callback
     * @returns A page of Users
     */
    find(
        options?: FindUsersOptions | ClientMethodCallback<UsersPage>,
        callback?: ClientMethodCallback<UsersPage>
    ): Promise<UsersPage> | void;

    /**
     * @summary Search Users
     *
     * @returns A page of Users
     */
    search(): Promise<UsersPage>;
    /**
     * @summary Search Users
     *
     * @param options Filter criteria to narrow Users returned
     * @returns A page of Users
     */
    search(options: SearchUsersOptions): Promise<UsersPage>;
    /**
     * @summary Search Users
     *
     * @param callback The callback
     */
    search(callback: ClientMethodCallback<UsersPage>): void;
    /**
     * @summary Search Users
     *
     * @param options Filter criteria to narrow Users returned
     * @param callback The callback
     */
    search(options: SearchUsersOptions, callback: ClientMethodCallback<UsersPage>): void;
    /**
     * @summary Search Users
     *
     * @param options Filter criteria to narrow Users returned
     * @param callback The callback
     * @returns A page of Users
     */
    search(
        options?: SearchUsersOptions | ClientMethodCallback<UsersPage>,
        callback?: ClientMethodCallback<UsersPage>
    ): Promise<UsersPage> | void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindUsersOptions extends BaseFindOptions {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchUsersOptions extends BaseSearchOptions {}
