import { CatalyticSDKAPI, CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import { CredentialsProvider } from './Credentials';

import BaseClient from './BaseClient';

export default class PushbotClient extends BaseClient {
    private isTestMode: boolean;

    constructor(internalClient: CatalyticSDKAPI, credentialsProvider: CredentialsProvider) {
        super(internalClient, credentialsProvider);
    }

    async get(id: string): Promise<CatalyticSDKAPIModels.Pushbot> {
        console.log(`Getting Pushbot with ID '${id}'`);
        const headers = this.getRequestHeaders();
        const result = await this.internalClient.getPushbot(id, { customHeaders: headers });
        console.log('HERE:');
        console.log(result);
        console.log('\n\n');
        return result.body;
    }
}
