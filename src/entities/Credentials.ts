import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export enum CredentialsType {
    worker = 'actionWorker',
    user = 'user'
}

export default class Credentials implements CatalyticSDKAPIModels.Credentials {
    /**
     * The name of the Credentials
     */
    name?: string;
    /**
     * The unique ID of the Credentials
     */
    id: string;
    /**
     * The deserialized secret of the Credentials
     */
    secret?: string;
    /**
     * The Domain of the Catalytic team with which these Credentials are associated
     */
    domain: string;
    /**
     * The serialized Credentials Token
     */
    token?: string;
    /**
     * The environment of the Catalytic team associated with the Credentials
     */
    environment?: string;
    /**
     * The email address of the user to whom these Credentials belong
     */
    owner?: string;
    /**
     * The "type" of the Credentials. Possible values include:
     * 'user', 'actionWorker'
     */
    type?: CredentialsType;

    constructor(token: string) {
        this.token = token;
    }
}

export interface CredentialsProvider {
    credentials: Credentials;
}
