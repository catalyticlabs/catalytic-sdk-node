import BaseClient from './BaseClient';
import { User } from '../entities';

export default class UserClient extends BaseClient {
    async get(id: string): Promise<User> {
        console.log(`Getting User with Id '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getUser(id, { customHeaders: headers });
        return this.parseResponse<User>(result);
    }
}
