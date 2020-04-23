import { Credentials as InternalCredentials } from '../internal/lib/models';
import InvalidCredentialsError from '../errors/InvalidCredentialsError';
import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

enum CredentialsType {
    worker = 'actionWorker',
    user = 'user'
}

// TODO do we even need to deserialize the Credentials in the SDK Client?

export default class Credentials implements CatalyticSDKAPIModels.Credentials {
    /**
     * The name of the Credentials
     */
    name: string;
    /**
     * The unique ID of the Credentials
     */
    id: string;
    /**
     * The deserialized secret of the Credentials
     */
    secret: string;
    /**
     * The Domain of the Catalytic team with which these Credentials are associated
     */
    domain: string;
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
        const decoded = Buffer.from(this.token, 'base64').toString();
        const parts = decoded.split(':');

        if (parts.length != 4) {
            throw new InvalidCredentialsError('Invalid token provided');
        }

        this.id = parts[0];
        this.secret = parts[1];
        this.domain = parts[2];
        this.environment = parts[3];
    }

    fromInternal(internalCredentials: InternalCredentials): Credentials {
        const credentials = new Credentials(internalCredentials.token);
        credentials.name = internalCredentials.name;
        if (!credentials.token) {
            credentials.id = internalCredentials.id;
            credentials.secret = internalCredentials.secret;
            credentials.domain = internalCredentials.domain;
            credentials.environment = internalCredentials.environment;
        }
        credentials.owner = internalCredentials.owner;
        credentials.type = CredentialsType[internalCredentials.type];
        return credentials;
    }
}

export interface CredentialsProvider {
    credentials: Credentials;
}
