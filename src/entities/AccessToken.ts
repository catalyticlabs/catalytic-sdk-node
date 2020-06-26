import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export enum AccessTokenType {
    user = 'user'
}

export default class AccessToken implements CatalyticSDKAPIModels.AccessToken {
    /**
     * The name of the AccessToken
     */
    name?: string;
    /**
     * The unique ID of the AccessToken
     */
    id: string;
    /**
     * The deserialized secret of the AccessToken
     */
    secret?: string;
    /**
     * The Domain of the Catalytic team with which these AccessToken are associated
     */
    domain: string;
    /**
     * The serialized AccessToken Token
     */
    token?: string;
    /**
     * The environment of the Catalytic team associated with the AccessToken
     */
    environment?: string;
    /**
     * The email address of the user to whom these AccessToken belong
     */
    owner?: string;
    /**
     * The "type" of the AccessToken. Possible values include:
     * 'user', 'actionWorker'
     */
    type?: AccessTokenType;

    /**
     * Construct an AccessToken class instance for an already created Access Token
     * @param token The serialized Access Token string, available on creation of new Access Token via UI or SDK
     */
    constructor(token: string) {
        this.token = token;
    }
}
