import { CatalyticSDKAPI } from './internal/lib/catalyticSDKAPI';
import Credentials from './entities/Credentials';
import ClientProvider from './clients/ClientProvider';
import { version } from '../package.json';

import { CredentialsClient, DataTableClient, FileClient, InstanceClient, UserClient, WorkflowClient } from './clients';

export default class CatalyticClient implements CredentialsProvider {
    public credentials: Credentials;
    public internalClient: CatalyticSDKAPI;

    // TODO do I need this? Can I just create the clients directly in the Client constructor?
    public clientProvider: ClientProvider;

    public credentialsClient: CredentialsClient;
    public dataTableClient: DataTableClient;
    public fileClient: FileClient;
    public instanceClient: InstanceClient;
    public userClient: UserClient;
    public workflowClient: WorkflowClient;

    constructor(baseUri?: string) {
        this.internalClient = new CatalyticSDKAPI({
            baseUri,
            userAgent: (defaultUserAgent): string => `catalytic-sdk-node/${version} ${defaultUserAgent}`
        });
        this.clientProvider = new ClientProvider(this.internalClient, this);

        this.credentialsClient = this.clientProvider.getCredentialsClient();
        this.dataTableClient = this.clientProvider.getDataTableClient();
        this.fileClient = this.clientProvider.getFileClient();
        this.instanceClient = this.clientProvider.getInstanceClient();
        this.userClient = this.clientProvider.getUserClient();
        this.workflowClient = this.clientProvider.getWorkflowClient();
    }
}

export interface CredentialsProvider {
    credentials: Credentials;
}
