import { CatalyticSDKAPI } from '../internal/lib/catalyticSDKAPI';
import { CredentialsProvider } from './Credentials';

export default class BaseClient {
    public internalClient: CatalyticSDKAPI;
    public credentialsProvider: CredentialsProvider;

    constructor(internalClient: CatalyticSDKAPI, credentialsProvider: CredentialsProvider) {
        this.internalClient = internalClient;
        this.credentialsProvider = credentialsProvider;
    }

    getRequestHeaders(): { [headerName: string]: string } {
        const credentials = this.credentialsProvider.credentials;
        const base64Credentials = Buffer.from(credentials.accessIdentifier + ':' + credentials.secret).toString(
            'base64'
        );
        return {
            Authorization: `Basic ${base64Credentials}`
        };
    }
}
