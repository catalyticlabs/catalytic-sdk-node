import { CatalyticSDKAPI } from './internal/lib/catalyticSDKAPI';
import Credentials, { CredentialsProvider } from './entities/Credentials';
import { UserAgent } from './constants';

import { CredentialsClient, DataTableClient, FileClient, InstanceClient, UserClient, WorkflowClient } from './clients';

export default class CatalyticClient implements CredentialsProvider {
    public credentials: Credentials;
    public internalClient: CatalyticSDKAPI;

    public credentialsClient: CredentialsClient;
    public dataTableClient: DataTableClient;
    public fileClient: FileClient;
    public instanceClient: InstanceClient;
    public userClient: UserClient;
    public workflowClient: WorkflowClient;

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
