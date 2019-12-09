import { CatalyticSDKAPI } from './internal/lib/catalyticSDKAPI';
import Credentials, { CredentialsProvider } from './clients/Credentials';
import ClientProvider from './clients/ClientProvider';
import DeveloperKeyClient from './clients/DeveloperKeyClient';
import PushbotClient from './clients/PushbotClient';

export default class Client implements CredentialsProvider {
    public credentials: Credentials;
    public internalClient: CatalyticSDKAPI;
    public clientProvider: ClientProvider;

    public developerKeyClient: DeveloperKeyClient;
    public pushbotClient: PushbotClient;

    constructor(baseUri: string) {
        this.internalClient = new CatalyticSDKAPI({ baseUri });
        this.clientProvider = new ClientProvider(this.internalClient, this);

        this.developerKeyClient = this.clientProvider.getDeveloperKeyClient();
        this.pushbotClient = this.clientProvider.getPushbotClient();
    }
}
