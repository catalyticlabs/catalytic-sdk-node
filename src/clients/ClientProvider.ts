import { CatalyticSDKAPI } from '../internal/lib/catalyticSDKAPI';
import { CredentialsProvider } from '../entities/Credentials';
import { CredentialsClient, DataTableClient, FileClient, InstanceClient, WorkflowClient, UserClient } from '.';

export default class ClientProvider {
    credentialsClient: CredentialsClient;
    dataTableClient: DataTableClient;
    fileClient: FileClient;
    instanceClient: InstanceClient;
    userClient: UserClient;
    workflowClient: WorkflowClient;

    constructor(internalClient: CatalyticSDKAPI, credentialsProvider: CredentialsProvider) {
        this.credentialsClient = new CredentialsClient(internalClient, credentialsProvider);
        this.dataTableClient = new DataTableClient(internalClient, credentialsProvider);
        this.fileClient = new FileClient(internalClient, credentialsProvider);
        this.instanceClient = new InstanceClient(internalClient, credentialsProvider);
        this.userClient = new UserClient(internalClient, credentialsProvider);
        this.workflowClient = new WorkflowClient(internalClient, credentialsProvider);
    }

    getCredentialsClient(): CredentialsClient {
        return this.credentialsClient;
    }

    getDataTableClient(): DataTableClient {
        return this.dataTableClient;
    }

    getFileClient(): FileClient {
        return this.fileClient;
    }

    getInstanceClient(): InstanceClient {
        return this.instanceClient;
    }

    getUserClient(): UserClient {
        return this.userClient;
    }

    getWorkflowClient(): WorkflowClient {
        return this.workflowClient;
    }
}
