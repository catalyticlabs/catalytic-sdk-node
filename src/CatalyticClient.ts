import { CatalyticSDKAPI } from './internal/lib/catalyticSDKAPI';
import AccessToken from './entities/AccessToken';
import { UserAgent } from './constants';
import { AccessTokenProvider } from './types';

import {
    AccessTokenClient,
    AccessTokenClientInterface,
    DataTableClient,
    DataTableClientInterface,
    FileClient,
    FileClientInterface,
    InstanceClient,
    InstanceClientInterface,
    UserClient,
    UserClientInterface,
    WorkflowClient,
    WorkflowClientInterface
} from './clients';
import { InvalidAccessTokenError } from './errors';

export default class CatalyticClient implements AccessTokenProvider, CatalyticClientInterface {
    _internalClient: CatalyticSDKAPI;

    public accessToken: AccessToken;

    public accessTokens: AccessTokenClientInterface;
    public dataTables: DataTableClientInterface;
    public files: FileClientInterface;
    public instances: InstanceClientInterface;
    public users: UserClientInterface;
    public workflows: WorkflowClientInterface;

    /**
     * @summary Construct a new CatalyticClient instance
     *
     * @param accessToken A serialized Access Token string or constructed Access Token instance to use for requests made by client
     */
    constructor(accessToken?: AccessToken | string) {
        this._internalClient = new CatalyticSDKAPI({
            userAgent: (defaultUserAgent): string => `${defaultUserAgent} ${UserAgent}`
        });

        if (accessToken) {
            this.setAccessToken(accessToken);
        }

        this.accessTokens = new AccessTokenClient(this._internalClient, this);
        this.dataTables = new DataTableClient(this._internalClient, this);
        this.files = new FileClient(this._internalClient, this);
        this.instances = new InstanceClient(this._internalClient, this);
        this.users = new UserClient(this._internalClient, this);
        this.workflows = new WorkflowClient(this._internalClient, this);
    }

    setAccessToken(accessToken: string | AccessToken): void {
        if (typeof accessToken === 'string') {
            this.accessToken = new AccessToken(accessToken);
        } else if (accessToken instanceof AccessToken) {
            this.accessToken = accessToken;
        } else {
            throw new InvalidAccessTokenError(`Invalid Access Token`);
        }
    }
}

export interface CatalyticClientInterface {
    accessTokens: AccessTokenClientInterface;
    dataTables: DataTableClientInterface;
    files: FileClientInterface;
    instances: InstanceClientInterface;
    users: UserClientInterface;
    workflows: WorkflowClientInterface;

    /**
     * @summary Sets the Access Token for requests made by client instance
     *
     * @param accessToken A serialized Access Token string or constructed Access Token instance
     */
    setAccessToken(accessToken: string | AccessToken): void;
}
