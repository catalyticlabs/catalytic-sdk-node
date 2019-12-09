import { DeveloperKey } from '../internal/lib/models';

export default class Credentials {
    public name: string;
    public accessIdentifier: string;
    public secret: string;
    public domain: string;

    fromDeveloperKey(developerKey: DeveloperKey): Credentials {
        const credentials = new Credentials();
        credentials.name = developerKey.name;
        credentials.accessIdentifier = developerKey.accessIdentifier;
        credentials.secret = developerKey.secret;
        credentials.domain = developerKey.domain;
        return credentials;
    }
}

export interface CredentialsProvider {
    credentials: Credentials;
}
