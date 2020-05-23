import faker from 'faker';
import { v4 } from 'uuid';

import { Credentials, DataTable, Instance, User, Workflow, FileMetadata } from '../../src/entities';

export const mockCredentials = (): Credentials => {
    const domain = faker.company.companyName().toLowerCase() + '.pushbot.com';
    const env = 'v1';
    const id = v4();
    const secret = v4();

    const token = Buffer.from([id, secret, domain, env].join(':')).toString('base64');

    return new Credentials(token);
};

export const mockDataTable = (): DataTable => {
    const values = {
        id: v4(),
        name: faker.random.words(3),
        teamName: faker.company.companyName().toLowerCase()
    };

    return values as DataTable;
};

export const mockFileMetadata = (): FileMetadata => {
    const values = {
        id: v4(),
        name: faker.random.words(3),
        teamName: faker.company.companyName().toLowerCase()
    };

    return values as FileMetadata;
};

export const mockInstance = (): Instance => {
    const values = {
        id: v4(),
        workflowId: v4(),
        name: faker.random.words(3),
        owner: faker.internet.email(),
        teamName: faker.company.companyName().toLowerCase()
    };

    return values as Instance;
};

export const mockUser = (): User => {
    const values = {
        id: v4(),
        username: faker.random.words(1).toLowerCase(),
        email: faker.internet.email(),
        teamName: faker.company.companyName().toLowerCase(),
        fullName: faker.name.firstName() + ' ' + faker.name.lastName()
    };

    return values as User;
};

export const mockWorkflow = (): Workflow => {
    const values = {
        id: v4(),
        name: faker.random.words(3),
        owner: faker.internet.email(),
        teamName: faker.company.companyName().toLowerCase()
    };

    return values as Workflow;
};

export default { mockCredentials, mockDataTable, mockFileMetadata, mockInstance, mockUser, mockWorkflow };
