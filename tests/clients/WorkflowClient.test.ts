import assert from 'assert';
import { expect } from 'chai';
import { v4 } from 'uuid';

import nockApi from '../nockApi';
import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';

describe('WorkflowClient', function() {
    let mockApi;

    before(function() {
        mockApi = nockApi();
    });

    describe('Get Workflow', function() {
        it('should get a Workflow by ID', async function() {
            const mockWorkflow = mock.mockWorkflow();
            let headers;
            mockApi.get(`/api/workflows/${mockWorkflow.id}`).reply(function() {
                headers = this.req.headers;
                return [200, mockWorkflow];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.workflowClient.get(mockWorkflow.id);

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockWorkflow)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should get a Workflow by ID with callback', function(done) {
            const mockWorkflow = mock.mockWorkflow();
            let headers;
            mockApi.get(`/api/workflows/${mockWorkflow.id}`).reply(function() {
                headers = this.req.headers;
                return [200, mockWorkflow];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.workflowClient.get(mockWorkflow.id, (err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockWorkflow)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should return proper exception when Workflow not found', async function() {
            const id = v4();
            let headers;
            mockApi.get(`/api/workflows/${id}`).reply(function() {
                headers = this.req.headers;
                return [404, { detail: 'Intentional not found error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            let error;
            let result;

            try {
                result = await client.workflowClient.get(id);
            } catch (e) {
                error = e;
            }

            expect(result).to.not.be.ok;
            expect(error).to.be.ok;
            expect(error.message).to.include('Intentional not found error');
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should return proper exception when Workflow not found with callback', function(done) {
            const id = v4();
            let headers;
            mockApi.get(`/api/workflows/${id}`).reply(function() {
                headers = this.req.headers;
                return [404, { detail: 'Intentional not found error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.workflowClient.get(id, (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });
    });

    describe('Find Workflows', function() {
        it('should find Workflows with no filter options', async function() {
            const mockWorkflowsPage = mock.mockWorkflowsPage();
            let headers;
            mockApi.get(`/api/workflows`).reply(function() {
                headers = this.req.headers;
                return [200, mockWorkflowsPage];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.workflowClient.find();

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockWorkflowsPage)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should find Workflows with no filter options and callback', function(done) {
            const mockWorkflowsPage = mock.mockWorkflowsPage();
            let headers;
            mockApi.get(`/api/workflows`).reply(function() {
                headers = this.req.headers;
                return [200, mockWorkflowsPage];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.workflowClient.find((err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockWorkflowsPage)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should find Workflows with filter options', async function() {
            const mockWorkflowsPage = mock.mockWorkflowsPage();
            const options = { pageSize: 3, query: 'some workflow', owner: 'test@example.com' };
            let headers;
            mockApi
                .get(`/api/workflows`)
                // eslint-disable-next-line @typescript-eslint/camelcase
                .query({ page_size: options.pageSize, query: options.query, owner: options.owner })
                .reply(function() {
                    headers = this.req.headers;
                    return [200, mockWorkflowsPage];
                });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.workflowClient.find(options);

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockWorkflowsPage)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should find Workflows with filter options and callback', function(done) {
            const mockWorkflowsPage = mock.mockWorkflowsPage();
            const options = { pageSize: 3, query: 'some workflow', owner: 'test@example.com' };
            let headers;
            mockApi
                .get(`/api/workflows`)
                // eslint-disable-next-line @typescript-eslint/camelcase
                .query({ page_size: options.pageSize, query: options.query, owner: options.owner })
                .reply(function() {
                    headers = this.req.headers;
                    return [200, mockWorkflowsPage];
                });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.workflowClient.find(options, (err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockWorkflowsPage)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should return exception when bad response code returned', async function() {
            let headers;
            mockApi.get(`/api/workflows`).reply(function() {
                headers = this.req.headers;
                return [400, { detail: 'Intentional bad request error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            let error;
            let result;

            try {
                result = await client.workflowClient.find();
            } catch (e) {
                error = e;
            }

            expect(result).to.not.be.ok;
            expect(error).to.be.ok;
            expect(error.message).to.include('Intentional bad request error');
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should return exception when bad response code returned with callback', function(done) {
            let headers;
            mockApi.get(`/api/workflows`).reply(function() {
                headers = this.req.headers;
                return [400, { detail: 'Intentional bad request error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.workflowClient.find((error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional bad request error');
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });
    });
});
