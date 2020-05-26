import BaseClient, { FindOptions } from './BaseClient';
import { User, UsersPage } from '../entities';

export default class UserClient extends BaseClient {
    async get(id: string): Promise<User> {
        console.log(`Getting User with Id '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getUser(id, { customHeaders: headers });
        return this.parseResponse<User>(result);
    }

    async find(options?: FindUserOptions): Promise<UsersPage> {
        console.log('Finding users');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findUsers(Object.assign({}, options, { customHeaders: headers }));
        return this.parseResponse<UsersPage>(result);
    }
}

export class FindUserOptions extends FindOptions {}
