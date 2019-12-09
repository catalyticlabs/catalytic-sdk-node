import { CatalyticSDKAPI } from '../internal/lib/catalyticSDKAPI';
import DeveloperKeyClient from './DeveloperKeyClient';
import PushbotClient from './PushbotClient';
import { CredentialsProvider } from './Credentials';

export default class ClientProvider {
    developerKeyClient: DeveloperKeyClient;
    pushbotClient: PushbotClient;

    constructor(internalClient: CatalyticSDKAPI, credentialsProvider: CredentialsProvider) {
        this.developerKeyClient = new DeveloperKeyClient(internalClient, credentialsProvider);
        this.pushbotClient = new PushbotClient(internalClient, credentialsProvider);
    }

    getDeveloperKeyClient(): DeveloperKeyClient {
        return this.developerKeyClient;
    }

    getPushbotClient(): PushbotClient {
        return this.pushbotClient;
    }
}
