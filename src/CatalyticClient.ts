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

export default class CatalyticClient implements AccessTokenProvider, CatalyticClientInterface {
    _internalClient: CatalyticSDKAPI;

    public accessToken: AccessToken;

    public accessTokenClient: AccessTokenClientInterface;
    public dataTableClient: DataTableClientInterface;
    public fileClient: FileClientInterface;
    public instanceClient: InstanceClientInterface;
    public userClient: UserClientInterface;
    public workflowClient: WorkflowClientInterface;

    constructor(baseUri?: string) {
        this._internalClient = new CatalyticSDKAPI({
            baseUri,
            userAgent: (defaultUserAgent): string => `${defaultUserAgent} ${UserAgent}`
        });

        this.accessTokenClient = new AccessTokenClient(this._internalClient, this);
        this.dataTableClient = new DataTableClient(this._internalClient, this);
        this.fileClient = new FileClient(this._internalClient, this);
        this.instanceClient = new InstanceClient(this._internalClient, this);
        this.userClient = new UserClient(this._internalClient, this);
        this.workflowClient = new WorkflowClient(this._internalClient, this);
    }
}

export interface CatalyticClientInterface {
    accessTokenClient: AccessTokenClientInterface;
    dataTableClient: DataTableClientInterface;
    fileClient: FileClientInterface;
    instanceClient: InstanceClientInterface;
    userClient: UserClientInterface;
    workflowClient: WorkflowClientInterface;
}
