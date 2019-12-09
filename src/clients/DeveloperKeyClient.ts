import { CatalyticSDKAPI, CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import { CredentialsProvider } from './Credentials';

import BaseClient from './BaseClient';

export default class DeveloperKeyClient extends BaseClient {
    private isTestMode: boolean;

    constructor(internalClient: CatalyticSDKAPI, credentialsProvider: CredentialsProvider, isTestMode = false) {
        super(internalClient, credentialsProvider);
        this.isTestMode = isTestMode;
    }

    async create(domain: string): Promise<CatalyticSDKAPIModels.DeveloperKey> {
        console.log(`Creating Developer Key on domain '${domain}'`);
        const requestBody: CatalyticSDKAPIModels.CreateDeveloperKeyRequest = { domain };
        const result = await this.internalClient.createDeveloperKey({ body: requestBody });
        return result.body;
    }
}
