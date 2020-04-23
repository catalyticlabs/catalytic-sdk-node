import BaseClient from './BaseClient';
import { Instance } from '../entities';

export default class InstanceClient extends BaseClient {
    async get(id: string): Promise<Instance> {
        console.log(`Getting Instance with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getInstance(id, { customHeaders: headers });
        return this.parseResponse<Instance>(result);
    }
}
