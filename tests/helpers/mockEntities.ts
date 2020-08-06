import faker from 'faker';
import { v4 } from 'uuid';

import {
    AccessToken,
    DataTable,
    Instance,
    InstanceStep,
    User,
    Workflow,
    FileMetadata,
    UsersPage,
    WorkflowsPage,
    InstancesPage,
    InstanceStepsPage,
    AccessTokensPage,
    DataTablesPage,
    FileMetadataPage,
    Integration,
    IntegrationConnection,
    IntegrationsPage,
    IntegrationConfiguration
} from '../../src/entities';
import { WorkflowImport } from '../../src/internal/lib/models';

export const mockAccessToken = (): AccessToken => {
    const domain = faker.company.companyName().toLowerCase() + '.pushbot.com';
    const environment = 'v1';
    const id = v4();
    const secret = v4();

    const token = Buffer.from([id, secret, domain, environment].join(':')).toString('base64');

    return new AccessToken(token);
};

export const mockAccessTokensPage = (): AccessTokensPage => {
    const accessTokens = [mockAccessToken(), mockAccessToken()];

    return { accessTokens };
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

export const mockInstanceStep = (): InstanceStep => {
    const values = {
        id: v4(),
        instanceId: v4(),
        workflowId: v4(),
        name: faker.random.words(3),
        owner: faker.internet.email(),
        teamName: faker.company.companyName().toLowerCase()
    };

    return values;
};

export const mockInstanceStepsPage = (): InstanceStepsPage => {
    const steps = [mockInstanceStep(), mockInstanceStep()];

    return { steps };
};

export const mockIntegration = (): Integration => {
    const values: Integration = {
        name: faker.random.words(3),
        id: [faker.random.word(), faker.random.word(), 'v1'].join('/'),
        isCustomIntegration: true
    };
    values.referenceName = values.id;
    values.connections = [
        mockIntegrationConnection(values.id),
        mockIntegrationConnection(values.id),
        mockIntegrationConnection(values.id)
    ];

    return values;
};

export const mockIntegrationConfiguration = (): IntegrationConfiguration => {
    const values: IntegrationConfiguration = {
        clientId: v4(),
        clientSecret: v4(),
        tokenPath: '/oauth/token',
        revokePath: '/oauth/revoke',
        site: faker.internet.url(),
        authorizeBaseUrl: faker.internet.url(),
        scopes: ['read', 'write'],
        useBodyAuth: false
    };

    return values;
};

export const mockIntegrationConnection = (integrationId?: string): IntegrationConnection => {
    const values: IntegrationConnection = {
        name: faker.random.words(3),
        id: v4(),
        referenceName: v4(),
        integrationId: integrationId || [faker.random.word(), faker.random.word(), 'v1'].join('/')
    };

    return values;
};

export const mockIntegrationsPage = (): IntegrationsPage => {
    const integrations = [mockIntegration(), mockIntegration()];

    return { integrations };
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
    mockAccessToken,
    mockAccessTokensPage,
    mockDataTable,
    mockDataTablesPage,
    mockFileMetadata,
    mockFileMetadataPage,
    mockInstance,
    mockInstancesPage,
    mockInstanceStep,
    mockInstanceStepsPage,
    mockIntegration,
    mockIntegrationConfiguration,
    mockIntegrationConnection,
    mockIntegrationsPage,
    mockUser,
    mockUsersPage,
    mockWorkflow,
    mockWorkflowImport,
    mockWorkflowsPage
};
