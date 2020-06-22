import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';
import { createResponse, executeTest } from '../helpers';

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

            return executeTest(client.accessTokenClient, 'get', [mockAccessToken.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockAccessToken)));
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

            return executeTest(client.accessTokenClient, 'get', [id], (error, result) => {
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

            return executeTest(client.accessTokenClient, 'find', [], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockAccessTokensPage)));
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

            return executeTest(client.accessTokenClient, 'find', [options], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockAccessTokensPage)));
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

            return executeTest(client.accessTokenClient, 'find', [], (error, result) => {
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
});
