import faker from 'faker';
import { v4 } from 'uuid';

import {
    Credentials,
    DataTable,
    Instance,
    User,
    Workflow,
    FileMetadata,
    UsersPage,
    WorkflowsPage,
    InstancesPage,
    CredentialsPage,
    DataTablesPage,
    FileMetadataPage
} from '../../src/entities';
import { WorkflowImport } from '../../src/internal/lib/models';

export const mockCredentials = (): Credentials => {
    const domain = faker.company.companyName().toLowerCase() + '.pushbot.com';
    const environment = 'v1';
    const id = v4();
    const secret = v4();

    const token = Buffer.from([id, secret, domain, environment].join(':')).toString('base64');

    return { id, domain, environment, secret, token };
};

export const mockCredentialsPage = (): CredentialsPage => {
    const credentials = [mockCredentials(), mockCredentials()];

    return { credentials };
};

export const mockDataTable = (): DataTable => {
    const values = {
        id: v4(),
        name: faker.random.words(3),
        teamName: faker.company.companyName().toLowerCase()
    };

    return values;
};

export const mockDataTablesPage = (): DataTablesPage => {
    const dataTables = [mockDataTable(), mockDataTable()];
    return { dataTables };
};

export const mockFileMetadata = (): FileMetadata => {
    const values = {
        id: v4(),
        name: faker.random.words(3),
        teamName: faker.company.companyName().toLowerCase()
    };

    return values;
};

export const mockFileMetadataPage = (): FileMetadataPage => {
    const files = [mockFileMetadata()];

    return { files, count: files.length };
};

export const mockInstance = (): Instance => {
    const values = {
        id: v4(),
        workflowId: v4(),
        name: faker.random.words(3),
        owner: faker.internet.email(),
        teamName: faker.company.companyName().toLowerCase()
    };

    return values;
};

export const mockInstancesPage = (): InstancesPage => {
    const instances = [mockInstance(), mockInstance()];

    return { instances };
};

export const mockUser = (): User => {
    const values = {
        id: v4(),
        username: faker.random.words(1).toLowerCase(),
        email: faker.internet.email(),
        teamName: faker.company.companyName().toLowerCase(),
        fullName: faker.name.firstName() + ' ' + faker.name.lastName()
    };

    return values;
};

export const mockUsersPage = (): UsersPage => {
    const users = [mockUser(), mockUser()];

    return { users };
};

export const mockWorkflow = (): Workflow => {
    const values = {
        id: v4(),
        name: faker.random.words(3),
        owner: faker.internet.email(),
        teamName: faker.company.companyName().toLowerCase()
    };

    return values;
};

export const mockWorkflowImport = (): WorkflowImport => {
    const values = {
        id: v4(),
        name: faker.random.words(3),
        workflowId: v4(),
        errorMessage: null
    };

    return values;
};

export const mockWorkflowsPage = (): WorkflowsPage => {
    const workflows = [mockWorkflow(), mockWorkflow()];

    return { workflows };
};

export default {
    mockCredentials,
    mockCredentialsPage,
    mockDataTable,
    mockDataTablesPage,
    mockFileMetadata,
    mockFileMetadataPage,
    mockInstance,
    mockInstancesPage,
    mockUser,
    mockUsersPage,
    mockWorkflow,
    mockWorkflowImport,
    mockWorkflowsPage
};
