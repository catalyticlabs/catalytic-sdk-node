import assert from 'assert';
import { expect } from 'chai';
import { v4 } from 'uuid';

import nockApi from '../nockApi';
import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';

describe('CredentialsClient', function() {
    let mockApi;

    before(function() {
        mockApi = nockApi();
    });

    describe('Get Credentials', function() {
        it('should get Credentials by ID', async function() {
            const mockCredentials = mock.mockCredentials();
            let headers;
            mockApi.get(`/api/credentials/${mockCredentials.id}`).reply(function() {
                headers = this.req.headers;
                return [200, mockCredentials];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.credentialsClient.get(mockCredentials.id);

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockCredentials)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should get Credentials by ID with callback', function(done) {
            const mockCredentials = mock.mockCredentials();
            let headers;
            mockApi.get(`/api/credentials/${mockCredentials.id}`).reply(function() {
                headers = this.req.headers;
                return [200, mockCredentials];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.credentialsClient.get(mockCredentials.id, (err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockCredentials)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should return proper exception when Credentials not found', async function() {
            const id = v4();
            let headers;
            mockApi.get(`/api/credentials/${id}`).reply(function() {
                headers = this.req.headers;
                return [404, { detail: 'Intentional not found error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            let error;
            let result;

            try {
                result = await client.credentialsClient.get(id);
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

        it('should return proper exception when Credentials not found with callback', function(done) {
            const id = v4();
            let headers;
            mockApi.get(`/api/credentials/${id}`).reply(function() {
                headers = this.req.headers;
                return [404, { detail: 'Intentional not found error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.credentialsClient.get(id, (error, result) => {
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

    describe('Find Credentials', function() {
        it('should find Credentials with no filter options', async function() {
            const mockCredentialsPage = mock.mockCredentialsPage();
            let headers;
            mockApi.get(`/api/credentials`).reply(function() {
                headers = this.req.headers;
                return [200, mockCredentialsPage];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.credentialsClient.find();

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockCredentialsPage)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should find Credentials with no filter options and callback', function(done) {
            const mockCredentialsPage = mock.mockCredentialsPage();
            let headers;
            mockApi.get(`/api/credentials`).reply(function() {
                headers = this.req.headers;
                return [200, mockCredentialsPage];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.credentialsClient.find((err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockCredentialsPage)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should find Credentials with filter options', async function() {
            const mockCredentialsPage = mock.mockCredentialsPage();
            const options = { pageSize: 3, query: 'some credentials', owner: 'test@example.com' };
            let headers;
            mockApi
                .get(`/api/credentials`)
                // eslint-disable-next-line @typescript-eslint/camelcase
                .query({ page_size: options.pageSize, query: options.query, owner: options.owner })
                .reply(function() {
                    headers = this.req.headers;
                    return [200, mockCredentialsPage];
                });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.credentialsClient.find(options);

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockCredentialsPage)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should find Credentials with filter options and callback', function(done) {
            const mockCredentialsPage = mock.mockCredentialsPage();
            const options = { pageSize: 3, query: 'some credentials', owner: 'test@example.com' };
            let headers;
            mockApi
                .get(`/api/credentials`)
                // eslint-disable-next-line @typescript-eslint/camelcase
                .query({ page_size: options.pageSize, query: options.query, owner: options.owner })
                .reply(function() {
                    headers = this.req.headers;
                    return [200, mockCredentialsPage];
                });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.credentialsClient.find(options, (err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockCredentialsPage)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should return exception when bad response code returned', async function() {
            let headers;
            mockApi.get(`/api/credentials`).reply(function() {
                headers = this.req.headers;
                return [400, { detail: 'Intentional bad request error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            let error;
            let result;

            try {
                result = await client.credentialsClient.find();
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
            mockApi.get(`/api/credentials`).reply(function() {
                headers = this.req.headers;
                return [400, { detail: 'Intentional bad request error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.credentialsClient.find((error, result) => {
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
