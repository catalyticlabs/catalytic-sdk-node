import assert from 'assert';
import { expect } from 'chai';
import { v4 } from 'uuid';

import nockApi from '../nockApi';
import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';

describe('UserClient', function() {
    let mockApi;

    before(function() {
        mockApi = nockApi();
    });

    describe('Get User', function() {
        it('should get a User by ID', async function() {
            const mockUser = mock.mockUser();
            let headers;
            mockApi.get(`/api/users/${mockUser.id}`).reply(function() {
                headers = this.req.headers;
                return [200, mockUser];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.userClient.get(mockUser.id);

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockUser)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should get a User by ID with callback', function(done) {
            const mockUser = mock.mockUser();
            let headers;
            mockApi.get(`/api/users/${mockUser.id}`).reply(function() {
                headers = this.req.headers;
                return [200, mockUser];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.userClient.get(mockUser.id, (err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockUser)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should return proper exception when User not found', async function() {
            const id = v4();
            let headers;
            mockApi.get(`/api/users/${id}`).reply(function() {
                headers = this.req.headers;
                return [404, { detail: 'Intentional not found error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            let error;
            let result;

            try {
                result = await client.userClient.get(id);
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

        it('should return proper exception when User not found with callback', function(done) {
            const id = v4();
            let headers;
            mockApi.get(`/api/users/${id}`).reply(function() {
                headers = this.req.headers;
                return [404, { detail: 'Intentional not found error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.userClient.get(id, (error, result) => {
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

    describe('Find Users', function() {
        it('should find Users with no filter options', async function() {
            const mockUsersPage = mock.mockUsersPage();
            let headers;
            mockApi.get(`/api/users`).reply(function() {
                headers = this.req.headers;
                return [200, mockUsersPage];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.userClient.find();

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockUsersPage)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should find Users with no filter options and callback', function(done) {
            const mockUsersPage = mock.mockUsersPage();
            let headers;
            mockApi.get(`/api/users`).reply(function() {
                headers = this.req.headers;
                return [200, mockUsersPage];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.userClient.find((err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockUsersPage)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should find Users with filter options', async function() {
            const mockUsersPage = mock.mockUsersPage();
            const options = { pageSize: 3, query: 'some user' };
            let headers;
            mockApi
                .get(`/api/users`)
                // eslint-disable-next-line @typescript-eslint/camelcase
                .query({ page_size: options.pageSize, query: options.query })
                .reply(function() {
                    headers = this.req.headers;
                    return [200, mockUsersPage];
                });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.userClient.find(options);

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockUsersPage)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should find Users with filter options and callback', function(done) {
            const mockUsersPage = mock.mockUsersPage();
            const options = { pageSize: 3, query: 'some user' };
            let headers;
            mockApi
                .get(`/api/users`)
                // eslint-disable-next-line @typescript-eslint/camelcase
                .query({ page_size: options.pageSize, query: options.query })
                .reply(function() {
                    headers = this.req.headers;
                    return [200, mockUsersPage];
                });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.userClient.find(options, (err, result) => {
                assert.ifError(err);

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockUsersPage)));
                expect(headers.authorization)
                    .to.be.an('array')
                    .that.includes(`Bearer ${client.credentials.token}`);

                done();
            });
        });

        it('should return exception when bad response code returned', async function() {
            let headers;
            mockApi.get(`/api/users`).reply(function() {
                headers = this.req.headers;
                return [400, { detail: 'Intentional bad request error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            let error;
            let result;

            try {
                result = await client.userClient.find();
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
            mockApi.get(`/api/users`).reply(function() {
                headers = this.req.headers;
                return [400, { detail: 'Intentional bad request error' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            client.userClient.find((error, result) => {
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
