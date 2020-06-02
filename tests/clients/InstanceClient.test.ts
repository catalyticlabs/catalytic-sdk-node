import assert from 'assert';
import { expect } from 'chai';
import { v4 } from 'uuid';

import nockApi from '../nockApi';
import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';

describe('InstanceClient', function() {
    let mockApi;

    before(function() {
        mockApi = nockApi();
    });

    describe('Get Instance', function() {
        it('should get a Instance by ID', async function() {
            const mockInstance = mock.mockInstance();
            let headers;
            mockApi.get(`/api/instances/${mockInstance.id}`).reply(function() {
                headers = this.req.headers;
                return [200, mockInstance];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.instanceClient.get(mockInstance.id);

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should get a Instance by ID with callback', function(done) {
            const mockInstance = mock.mockInstance();
            let headers;
            mockApi.get(`/api/instances/${mockInstance.id}`).reply(function() {
                headers = this.req.headers;
                return [200, mockInstance];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.instanceClient.get(mockInstance.id, (err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should return proper exception when Instance not found', async function() {
            const id = v4();
            let headers;
            mockApi.get(`/api/instances/${id}`).reply(function() {
                headers = this.req.headers;
                return [404, { detail: 'Intentional not found error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            let error;
            let result;

            try {
                result = await client.instanceClient.get(id);
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

        it('should return proper exception when Instance not found with callback', function(done) {
            const id = v4();
            let headers;
            mockApi.get(`/api/instances/${id}`).reply(function() {
                headers = this.req.headers;
                return [404, { detail: 'Intentional not found error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.instanceClient.get(id, (error, result) => {
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

    describe('Find Instances', function() {
        it('should find Instances with no filter options', async function() {
            const mockInstancesPage = mock.mockInstancesPage();
            let headers;
            mockApi.get(`/api/instances`).reply(function() {
                headers = this.req.headers;
                return [200, mockInstancesPage];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.instanceClient.find();

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstancesPage)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should find Instances with no filter options and callback', function(done) {
            const mockInstancesPage = mock.mockInstancesPage();
            let headers;
            mockApi.get(`/api/instances`).reply(function() {
                headers = this.req.headers;
                return [200, mockInstancesPage];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.instanceClient.find((err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstancesPage)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should find Instances with filter options', async function() {
            const mockInstancesPage = mock.mockInstancesPage();
            const options = { pageSize: 3, query: 'some user', owner: 'test@example.com', workflowID: v4() };
            let headers;
            mockApi
                .get(`/api/instances`)
                .query({
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    page_size: options.pageSize,
                    query: options.query,
                    owner: options.owner,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    process_id: options.workflowID
                })
                .reply(function() {
                    headers = this.req.headers;
                    return [200, mockInstancesPage];
                });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.instanceClient.find(options);

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstancesPage)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should find Instances with filter options and callback', function(done) {
            const mockInstancesPage = mock.mockInstancesPage();
            const options = { pageSize: 3, query: 'some user', owner: 'test@example.com', workflowID: v4() };
            let headers;
            mockApi
                .get(`/api/instances`)
                // eslint-disable-next-line @typescript-eslint/camelcase
                .query({
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    page_size: options.pageSize,
                    query: options.query,
                    owner: options.owner,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    process_id: options.workflowID
                })
                .reply(function() {
                    headers = this.req.headers;
                    return [200, mockInstancesPage];
                });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.instanceClient.find(options, (err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstancesPage)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should return exception when bad response code returned', async function() {
            let headers;
            mockApi.get(`/api/instances`).reply(function() {
                headers = this.req.headers;
                return [400, { detail: 'Intentional bad request error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            let error;
            let result;

            try {
                result = await client.instanceClient.find();
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
            mockApi.get(`/api/instances`).reply(function() {
                headers = this.req.headers;
                return [400, { detail: 'Intentional bad request error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.instanceClient.find((error, result) => {
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
