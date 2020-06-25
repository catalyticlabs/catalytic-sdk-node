import { User, UsersPage } from '../entities';
import { BaseFindOptions, ClientMethodCallback } from '../types';

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
        console.log(`Getting User with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.getUser(id, { customHeaders: headers });
        return this.parseResponse<User>(result);
    }

    find(): Promise<UsersPage>;
    find(options: FindUserOptions): Promise<UsersPage>;
    find(callback: ClientMethodCallback<UsersPage>): void;
    find(options: FindUserOptions, callback: ClientMethodCallback<UsersPage>): void;
    find(
        options?: FindUserOptions | ClientMethodCallback<UsersPage>,
        callback?: ClientMethodCallback<UsersPage>
    ): Promise<UsersPage> | void {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return this.callbackifyBound(this._find)(options as FindUserOptions, callback);
        }

        return this._find(options as FindUserOptions);
    }
    private async _find(options: FindUserOptions): Promise<UsersPage> {
        console.log('Finding Users');
        const headers = this.getRequestHeaders();
        const result = await this._internalClient.findUsers(Object.assign({}, options, { customHeaders: headers }));
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
    find(options: FindUserOptions): Promise<UsersPage>;
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
    find(options: FindUserOptions, callback: ClientMethodCallback<UsersPage>): void;
    /**
     * @summary Finds Users
     *
     * @param options Filter criteria to narrow Users returned
     * @param callback The callback
     * @returns A page of Users
     */
    find(
        options?: FindUserOptions | ClientMethodCallback<UsersPage>,
        callback?: ClientMethodCallback<UsersPage>
    ): Promise<UsersPage> | void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindUserOptions extends BaseFindOptions {}
