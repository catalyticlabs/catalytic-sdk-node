import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';
import { createResponse, executeTest } from '../helpers';

describe('CredentialsClient', function() {
    let client: CatalyticClient;
    let expectedCustomHeaders;

    before(function() {
        client = new CatalyticClient();
        client.credentials = mock.mockCredentials();
        expectedCustomHeaders = { Authorization: `Bearer ${client.credentials.token}` };
    });

    afterEach(function() {
        sinon.restore();
    });

    describe('Get Credentials', function() {
        it('should get Credentials by ID', async function() {
            const mockCredentials = mock.mockCredentials();
            sinon
                .stub(client.internalClient, 'getCredentials')
                .callsFake(() => Promise.resolve(createResponse(mockCredentials)));

            return executeTest(client.credentialsClient, 'get', [mockCredentials.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockCredentials)));
                expect(client.internalClient.getCredentials).to.have.callCount(1);
                expect(client.internalClient.getCredentials).to.have.been.calledWith(mockCredentials.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when Credentials not found', async function() {
            const id = v4();
            sinon
                .stub(client.internalClient, 'getCredentials')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.credentialsClient, 'get', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client.internalClient.getCredentials).to.have.callCount(1);
                expect(client.internalClient.getCredentials).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Find Credentials', function() {
        it('should find Credentials with no filter options', async function() {
            const mockCredentialsPage = mock.mockCredentialsPage();
            sinon
                .stub(client.internalClient, 'findCredentials')
                .callsFake(() => Promise.resolve(createResponse(mockCredentialsPage)));

            return executeTest(client.credentialsClient, 'find', [], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockCredentialsPage)));
                expect(client.internalClient.findCredentials).to.have.callCount(1);
                expect(client.internalClient.findCredentials).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should find Credentials with filter options', async function() {
            const options = { pageSize: 3, query: 'some credentials', owner: 'test@example.com' };
            const mockCredentialsPage = mock.mockCredentialsPage();
            sinon
                .stub(client.internalClient, 'findCredentials')
                .callsFake(() => Promise.resolve(createResponse(mockCredentialsPage)));

            return executeTest(client.credentialsClient, 'find', [options], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockCredentialsPage)));
                expect(client.internalClient.findCredentials).to.have.callCount(1);
                expect(client.internalClient.findCredentials).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders,
                    ...options
                });
            });
        });

        it('should return exception when bad response code returned', async function() {
            sinon
                .stub(client.internalClient, 'findCredentials')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

            return executeTest(client.credentialsClient, 'find', [], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional bad request error');
                expect(client.internalClient.findCredentials).to.have.callCount(1);
                expect(client.internalClient.findCredentials).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });
});
