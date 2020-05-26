import BaseClient, { FindOptions } from './BaseClient';
import { Credentials, CredentialsPage } from '../entities';

export default class CredentialsClient extends BaseClient {
    async get(id: string): Promise<Credentials> {
        console.log(`Getting Credentials with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getCredentials(id, { customHeaders: headers });
        return this.parseResponse<Credentials>(result);
    }

    async find(options?: FindCredentialsOptions): Promise<CredentialsPage> {
        console.log('Finding Credentials');
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.findCredentials(
            Object.assign({}, options, { customHeaders: headers })
        );
        return this.parseResponse<CredentialsPage>(result);
    }

    async create(domain: string): Promise<Credentials> {
        console.log(`Creating Credentials on domain '${domain}'`);
        const result = await this.internalClient.createCredentials({ domain });
        return this.parseResponse<Credentials>(result);
    }
}

export class FindCredentialsOptions extends FindOptions {
    /**
     * The email address of the Credentials' owner
     */
    owner?: string;
}
