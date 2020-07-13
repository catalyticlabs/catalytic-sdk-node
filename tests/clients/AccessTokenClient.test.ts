import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import * as utils from '../../src/utils';
import mock from '../helpers/mockEntities';
import { cleanForDeepComparison, createResponse, executeTest } from '../helpers';
import { UnauthorizedError, ResourceNotFoundError } from '../../src/errors';

describe('AccessTokenClient', function() {
    let client: CatalyticClient;
    let expectedCustomHeaders;

    before(function() {
        client = new CatalyticClient();
        client.accessToken = mock.mockAccessToken();
        expectedCustomHeaders = { Authorization: `Bearer ${client.accessToken.token}` };
    });

    afterEach(function() {
        sinon.restore();
    });

    describe('Get AccessToken', function() {
        it('should get AccessToken by ID', async function() {
            const mockAccessToken = mock.mockAccessToken();
            sinon
                .stub(client._internalClient, 'getAccessToken')
                .callsFake(() => Promise.resolve(createResponse(mockAccessToken)));

            return executeTest(client.accessTokens, 'get', [mockAccessToken.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(cleanForDeepComparison(result)).to.deep.equal(cleanForDeepComparison(mockAccessToken));
                expect(client._internalClient.getAccessToken).to.have.callCount(1);
                expect(client._internalClient.getAccessToken).to.have.been.calledWith(mockAccessToken.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when AccessToken not found', async function() {
            const id = v4();
            sinon
                .stub(client._internalClient, 'getAccessToken')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.accessTokens, 'get', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client._internalClient.getAccessToken).to.have.callCount(1);
                expect(client._internalClient.getAccessToken).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Find AccessTokens', function() {
        it('should find AccessTokens with no filter options', async function() {
            const mockAccessTokensPage = mock.mockAccessTokensPage();
            sinon
                .stub(client._internalClient, 'findAccessTokens')
                .callsFake(() => Promise.resolve(createResponse(mockAccessTokensPage)));

            return executeTest(client.accessTokens, 'find', [], (err, result) => {
                expect(err).to.not.be.ok;

                expect(cleanForDeepComparison(result)).to.deep.equal(cleanForDeepComparison(mockAccessTokensPage));
                expect(client._internalClient.findAccessTokens).to.have.callCount(1);
                expect(client._internalClient.findAccessTokens).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should find AccessTokens with filter options', async function() {
            const options = { pageSize: 3, query: 'some access token', owner: 'test@example.com' };
            const mockAccessTokensPage = mock.mockAccessTokensPage();
            sinon
                .stub(client._internalClient, 'findAccessTokens')
                .callsFake(() => Promise.resolve(createResponse(mockAccessTokensPage)));

            return executeTest(client.accessTokens, 'find', [options], (err, result) => {
                expect(err).to.not.be.ok;

                expect(cleanForDeepComparison(result)).to.deep.equal(cleanForDeepComparison(mockAccessTokensPage));
                expect(client._internalClient.findAccessTokens).to.have.callCount(1);
                expect(client._internalClient.findAccessTokens).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders,
                    ...options
                });
            });
        });

        it('should return exception when bad response code returned', async function() {
            sinon
                .stub(client._internalClient, 'findAccessTokens')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

            return executeTest(client.accessTokens, 'find', [], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional bad request error');
                expect(client._internalClient.findAccessTokens).to.have.callCount(1);
                expect(client._internalClient.findAccessTokens).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Create Access Token', function() {
        it('should create a new AccessToken with teamName, email, and password', async function() {
            const teamName = 'my-team';
            const email = 'test-user@example.com';
            const password = 'P@$$w0rd';

            const mockAccessToken = mock.mockAccessToken();
            sinon
                .stub(client._internalClient, 'createAndApproveAccessToken')
                .callsFake(() => Promise.resolve(createResponse(mockAccessToken)));

            return executeTest(client.accessTokens, 'create', [teamName, email, password], (err, result) => {
                expect(err).to.not.be.ok;

                expect(cleanForDeepComparison(result)).to.deep.equal(cleanForDeepComparison(mockAccessToken));
                expect(client._internalClient.createAndApproveAccessToken).to.have.callCount(1);
                expect(client._internalClient.createAndApproveAccessToken).to.have.been.calledWith({
                    body: {
                        domain: utils.getDomainFromTeamName(teamName),
                        email,
                        password,
                        name: null
                    }
                });
            });
        });

        it('should create a new AccessToken with teamName, tokenName, email, and password', async function() {
            const teamName = 'my-team';
            const email = 'test-user@example.com';
            const password = 'P@$$w0rd';
            const tokenName = 'my-token';

            const mockAccessToken = mock.mockAccessToken();
            sinon
                .stub(client._internalClient, 'createAndApproveAccessToken')
                .callsFake(() => Promise.resolve(createResponse(mockAccessToken)));

            return executeTest(client.accessTokens, 'create', [teamName, email, password, tokenName], (err, result) => {
                expect(err).to.not.be.ok;

                expect(cleanForDeepComparison(result)).to.deep.equal(cleanForDeepComparison(mockAccessToken));
                expect(client._internalClient.createAndApproveAccessToken).to.have.callCount(1);
                expect(client._internalClient.createAndApproveAccessToken).to.have.been.calledWith({
                    body: {
                        domain: utils.getDomainFromTeamName(teamName),
                        email,
                        password,
                        name: tokenName
                    }
                });
            });
        });

        it('should return proper exception when AccessToken fails to create', async function() {
            const teamName = 'my-team';
            const email = 'test-user@example.com';
            const password = 'P@$$w0rd';

            sinon
                .stub(client._internalClient, 'createAndApproveAccessToken')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional unauthorized error' }, 401)));

            return executeTest(client.accessTokens, 'create', [teamName, email, password], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok.and.to.be.instanceOf(UnauthorizedError);
                expect(error.message).to.include('Intentional unauthorized error');
                expect(client._internalClient.createAndApproveAccessToken).to.have.callCount(1);
                expect(client._internalClient.createAndApproveAccessToken).to.have.been.calledWith({
                    body: {
                        domain: utils.getDomainFromTeamName(teamName),
                        email,
                        password,
                        name: null
                    }
                });
            });
        });
    });

    describe('Create Access Token with Web Approval Flow', function() {
        it('should create a new AccessToken with teamName, email, and password', async function() {
            const teamName = 'my-team';

            const mockAccessToken = mock.mockAccessToken();
            sinon
                .stub(client._internalClient, 'createAccessToken')
                .callsFake(() => Promise.resolve(createResponse(mockAccessToken)));

            return executeTest(client.accessTokens, 'createWithWebApprovalFlow', [teamName], (err, result) => {
                expect(err).to.not.be.ok;

                expect(cleanForDeepComparison(result)).to.deep.equal(cleanForDeepComparison(mockAccessToken));
                expect(client._internalClient.createAccessToken).to.have.callCount(1);
                expect(client._internalClient.createAccessToken).to.have.been.calledWith({
                    body: {
                        domain: utils.getDomainFromTeamName(teamName),
                        name: null
                    }
                });
            });
        });

        it('should create a new AccessToken with teamName, tokenName, email, and password', async function() {
            const teamName = 'my-team';
            const tokenName = 'my-token';

            const mockAccessToken = mock.mockAccessToken();
            sinon
                .stub(client._internalClient, 'createAccessToken')
                .callsFake(() => Promise.resolve(createResponse(mockAccessToken)));

            return executeTest(
                client.accessTokens,
                'createWithWebApprovalFlow',
                [teamName, tokenName],
                (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(cleanForDeepComparison(result)).to.deep.equal(cleanForDeepComparison(mockAccessToken));
                    expect(client._internalClient.createAccessToken).to.have.callCount(1);
                    expect(client._internalClient.createAccessToken).to.have.been.calledWith({
                        body: {
                            domain: utils.getDomainFromTeamName(teamName),
                            name: tokenName
                        }
                    });
                }
            );
        });

        it('should return proper exception when AccessToken fails to create', async function() {
            const teamName = 'my-team';

            sinon
                .stub(client._internalClient, 'createAccessToken')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional unauthorized error' }, 401)));

            return executeTest(client.accessTokens, 'createWithWebApprovalFlow', [teamName], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok.and.to.be.instanceOf(UnauthorizedError);
                expect(error.message).to.include('Intentional unauthorized error');
                expect(client._internalClient.createAccessToken).to.have.callCount(1);
                expect(client._internalClient.createAccessToken).to.have.been.calledWith({
                    body: {
                        domain: utils.getDomainFromTeamName(teamName),
                        name: null
                    }
                });
            });
        });
    });

    describe('Revoke AccessToken', function() {
        it('should revoke AccessToken by ID', async function() {
            const mockAccessToken = mock.mockAccessToken();
            sinon
                .stub(client._internalClient, 'revokeAccessToken')
                .callsFake(() => Promise.resolve(createResponse(mockAccessToken)));

            return executeTest(client.accessTokens, 'revoke', [mockAccessToken.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(cleanForDeepComparison(result)).to.deep.equal(cleanForDeepComparison(mockAccessToken));
                expect(client._internalClient.revokeAccessToken).to.have.callCount(1);
                expect(client._internalClient.revokeAccessToken).to.have.been.calledWith(mockAccessToken.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when AccessToken not found', async function() {
            const id = v4();
            sinon
                .stub(client._internalClient, 'revokeAccessToken')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.accessTokens, 'revoke', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client._internalClient.revokeAccessToken).to.have.callCount(1);
                expect(client._internalClient.revokeAccessToken).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Wait for AccessToken Approval', function() {
        it('should wait for AccessToken approval', async function() {
            const mockAccessToken = mock.mockAccessToken();
            sinon
                .stub(client._internalClient, 'waitForAccessTokenApproval')
                .callsFake(() => Promise.resolve(createResponse(mockAccessToken)));

            return executeTest(client.accessTokens, 'waitForApproval', [mockAccessToken], err => {
                expect(err).to.not.be.ok;

                expect(client._internalClient.waitForAccessTokenApproval).to.have.callCount(1);
                expect(client._internalClient.waitForAccessTokenApproval).to.have.been.calledWith({
                    body: {
                        token: mockAccessToken.token,
                        waitTimeMillis: null
                    }
                });
            });
        });

        it('should wait for AccessToken approval using provided waitTimeMillis', async function() {
            const mockAccessToken = mock.mockAccessToken();
            const waitTimeMillis = 5000;
            sinon
                .stub(client._internalClient, 'waitForAccessTokenApproval')
                .callsFake(() => Promise.resolve(createResponse(mockAccessToken)));

            return executeTest(client.accessTokens, 'waitForApproval', [mockAccessToken, waitTimeMillis], err => {
                expect(err).to.not.be.ok;

                expect(client._internalClient.waitForAccessTokenApproval).to.have.callCount(1);
                expect(client._internalClient.waitForAccessTokenApproval).to.have.been.calledWith({
                    body: {
                        token: mockAccessToken.token,
                        waitTimeMillis
                    }
                });
            });
        });

        it('should return proper exception when AccessToken not found', async function() {
            const mockAccessToken = mock.mockAccessToken();
            sinon
                .stub(client._internalClient, 'waitForAccessTokenApproval')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.accessTokens, 'waitForApproval', [mockAccessToken], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok.and.to.be.instanceOf(ResourceNotFoundError);
                expect(error.message).to.include('Intentional not found error');
                expect(client._internalClient.waitForAccessTokenApproval).to.have.callCount(1);
                expect(client._internalClient.waitForAccessTokenApproval).to.have.been.calledWith({
                    body: {
                        token: mockAccessToken.token,
                        waitTimeMillis: null
                    }
                });
            });
        });
    });

    describe('getApprovalUrl', function() {
        it('should get correct approval url', function() {
            const mockAccessToken = mock.mockAccessToken();
            const appName = 'my custom app';
            expect(client.accessTokens.getApprovalUrl(mockAccessToken)).to.equal(
                `https://${mockAccessToken.domain}/access-tokens/approve?userTokenID=${
                    mockAccessToken.id
                }&application=${encodeURIComponent('Catalytic SDK')}`
            );

            expect(client.accessTokens.getApprovalUrl(mockAccessToken, appName)).to.equal(
                `https://${mockAccessToken.domain}/access-tokens/approve?userTokenID=${
                    mockAccessToken.id
                }&application=${encodeURIComponent(appName)}`
            );
        });
    });

    describe('openUrl', function() {
        it('should open a URL', function() {
            const url = 'https://google.com';
            sinon.stub(utils, 'openUrl');
            client.accessTokens.openUrl(url);
            expect(utils.openUrl).to.have.callCount(1);
            expect(utils.openUrl).to.have.been.calledWith(url);
        });
    });
});
