import { CatalyticSDKAPI } from './internal/lib/catalyticSDKAPI';
import AccessToken from './entities/AccessToken/AccessToken';
import { UserAgent } from './constants';
import { AccessTokenProvider, Logger, LoggerProvider } from './types';

import {
    AccessTokenClient,
    AccessTokenClientInterface,
    DataTableClient,
    DataTableClientInterface,
    FileClient,
    FileClientInterface,
    InstanceClient,
    InstanceClientInterface,
    IntegrationClient,
    IntegrationClientInterface,
    UserClient,
    UserClientInterface,
    WorkflowClient,
    WorkflowClientInterface
} from './clients';
import { InvalidAccessTokenError } from './errors';

export default class CatalyticClient implements AccessTokenProvider, LoggerProvider, CatalyticClientInterface {
    _internalClient: CatalyticSDKAPI;

    public accessToken: AccessToken;
    public logger: Logger;

    public accessTokens: AccessTokenClientInterface;
    public dataTables: DataTableClientInterface;
    public files: FileClientInterface;
    public instances: InstanceClientInterface;
    public integrations: IntegrationClientInterface;
    public users: UserClientInterface;
    public workflows: WorkflowClientInterface;

    /**
     * @summary Construct a new CatalyticClient instance
     *
     * @param accessToken A serialized Access Token string or constructed Access Token instance to use for requests made by client
     */
    constructor(accessToken?: AccessToken | string, logger?: Logger) {
        this._internalClient = new CatalyticSDKAPI({
            userAgent: (defaultUserAgent): string => `${defaultUserAgent} ${UserAgent}`
        });

        if (accessToken) {
            this.setAccessToken(accessToken);
        } else {
            try {
                this.setAccessToken(AccessToken.default);
            } catch (e) {}
        }

        this.logger = logger;

        this.accessTokens = new AccessTokenClient(this._internalClient, this, this);
        this.dataTables = new DataTableClient(this._internalClient, this, this);
        this.files = new FileClient(this._internalClient, this, this);
        this.instances = new InstanceClient(this._internalClient, this, this);
        this.integrations = new IntegrationClient(this._internalClient, this, this);
        this.users = new UserClient(this._internalClient, this, this);
        this.workflows = new WorkflowClient(this._internalClient, this, this);
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
    integrations: IntegrationClientInterface;
    users: UserClientInterface;
    workflows: WorkflowClientInterface;

    /**
     * @summary Sets the Access Token for requests made by client instance
     *
     * @param accessToken A serialized Access Token string or constructed Access Token instance
     */
    setAccessToken(accessToken: string | AccessToken): void;
}
