import BaseClient from './BaseClient';
import { Credentials } from '../entities';

export default class CredentialsClient extends BaseClient {
    async get(id: string): Promise<Credentials> {
        console.log(`Getting Credentials with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getCredentials(id, { customHeaders: headers });
        return this.parseResponse<Credentials>(result);
    }

    async create(domain: string): Promise<Credentials> {
        console.log(`Creating Credentials on domain '${domain}'`);
        const result = await this.internalClient.createCredentials({ domain });
        return this.parseResponse<Credentials>(result);
    }
}
