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

    public accessTokenClient: AccessTokenClientInterface;
    public dataTableClient: DataTableClientInterface;
    public fileClient: FileClientInterface;
    public instanceClient: InstanceClientInterface;
    public userClient: UserClientInterface;
    public workflowClient: WorkflowClientInterface;

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

        this.accessTokenClient = new AccessTokenClient(this._internalClient, this);
        this.dataTableClient = new DataTableClient(this._internalClient, this);
        this.fileClient = new FileClient(this._internalClient, this);
        this.instanceClient = new InstanceClient(this._internalClient, this);
        this.userClient = new UserClient(this._internalClient, this);
        this.workflowClient = new WorkflowClient(this._internalClient, this);
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
    accessTokenClient: AccessTokenClientInterface;
    dataTableClient: DataTableClientInterface;
    fileClient: FileClientInterface;
    instanceClient: InstanceClientInterface;
    userClient: UserClientInterface;
    workflowClient: WorkflowClientInterface;

    /**
     * @summary Sets the Access Token for requests made by client instance
     *
     * @param accessToken A serialized Access Token string or constructed Access Token instance
     */
    setAccessToken(accessToken: string | AccessToken): void;
}
