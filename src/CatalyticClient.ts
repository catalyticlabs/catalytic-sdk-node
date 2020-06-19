import { CatalyticSDKAPI } from './internal/lib/catalyticSDKAPI';
import Credentials, { CredentialsProvider } from './entities/Credentials';
import { UserAgent } from './constants';

import {
    CredentialsClient,
    CredentialsClientInterface,
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

export default class CatalyticClient implements CredentialsProvider {
    public credentials: Credentials;
    public internalClient: CatalyticSDKAPI;

    public credentialsClient: CredentialsClientInterface;
    public dataTableClient: DataTableClientInterface;
    public fileClient: FileClientInterface;
    public instanceClient: InstanceClientInterface;
    public userClient: UserClientInterface;
    public workflowClient: WorkflowClientInterface;

    constructor(baseUri?: string) {
        this.internalClient = new CatalyticSDKAPI({
            baseUri,
            userAgent: (defaultUserAgent): string => `${defaultUserAgent} ${UserAgent}`
        });

        this.credentialsClient = new CredentialsClient(this.internalClient, this);
        this.dataTableClient = new DataTableClient(this.internalClient, this);
        this.fileClient = new FileClient(this.internalClient, this);
        this.instanceClient = new InstanceClient(this.internalClient, this);
        this.userClient = new UserClient(this.internalClient, this);
        this.workflowClient = new WorkflowClient(this.internalClient, this);
    }
}
