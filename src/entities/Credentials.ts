export enum CredentialsType {
    worker = 'actionWorker',
    user = 'user'
}

export default class Credentials {
    /**
     * The serialized Credentials Token
     */
    token: string;
    /**
     * The environment of the Catalytic team associated with the Credentials
     */
    environment: string;
    /**
     * The email address of the user to whom these Credentials belong
     */
    owner: string;
    /**
     * The "type" of the Credentials. Possible values include:
     * 'user', 'actionWorker'
     */
    type: CredentialsType;

    constructor(token: string) {
        this.token = token;
    }
}

export interface CredentialsProvider {
    credentials: Credentials;
}
