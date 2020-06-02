import { callbackify } from 'util';

import BaseClient, { FindOptions, ClientMethodCallback } from './BaseClient';
import { User, UsersPage } from '../entities';

export default class UserClient extends BaseClient {
    static entity = 'User';

    /**
     * Gets a User by ID
     *
     * @param id The ID of the User to get
     * @returns The User with the provided ID
     */
    get(id: string): Promise<User>;
    /**
     * Gets a User by ID
     *
     * @param id The ID of the User to get
     * @param callback The callback
     */
    get(id: string, callback: ClientMethodCallback<User>): void;
    /**
     * Gets a User by ID
     *
     * @param id The ID of the User to get
     * @param callback The optional callback
     * @returns The User with the provided ID
     */
    get(id: string, callback?: ClientMethodCallback<User>): Promise<User> | void {
        if (callback) {
            return callbackify(this._get).call(this, id, callback);
        }

        return this._get(id);
    }

    private async _get(id: string): Promise<User> {
        console.log(`Getting User with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getUser(id, { customHeaders: headers });
        return this.parseResponse<User>(result);
    }

    /**
     * Finds Users
     *
     * @returns A page of Users
     */
    find(): Promise<UsersPage>;
    /**
     * Finds Users
     *
     * @param options Filter criteria to narrow Users returned
     * @returns A page of Users
     */
    find(options: FindUserOptions): Promise<UsersPage>;
    /**
     * Finds Users
     *
     * @param callback The callback
     */
    find(callback: ClientMethodCallback<UsersPage>): void;
    /**
     * Finds Users
     *
     * @param options Filter criteria to narrow Users returned
     * @param callback The callback
     */
    find(options: FindUserOptions, callback: ClientMethodCallback<UsersPage>): void;
    /**
     * Finds Users
     *
     * @param options Filter criteria to narrow Users returned
     * @param callback The callback
     * @returns A page of Users
     */
    find(
        options?: FindUserOptions | ClientMethodCallback<UsersPage>,
        callback?: ClientMethodCallback<UsersPage>
    ): Promise<UsersPage> | void {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        if (callback) {
            return callbackify(this._find).call(this, options, callback);
        }

        return this._find(options as FindUserOptions);
    }
    private async _find(options?: FindUserOptions): Promise<UsersPage> {
        console.log('Finding Users');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findUsers(Object.assign({}, options, { customHeaders: headers }));
        return this.parseResponse<UsersPage>(result);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindUserOptions extends FindOptions {}
