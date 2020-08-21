import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';
import { createResponse, executeTest } from '../helpers';
import { IntegrationCreationRequest, IntegrationUpdateRequest, FieldType } from '../../src/entities';
import { UnauthorizedError, FieldInputError } from '../../src/errors';

describe('IntegrationClient', function() {
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

    describe('Get Integration', function() {
        it('should get a Integration by ID', async function() {
            const mockIntegration = mock.mockIntegration();
            sinon
                .stub(client._internalClient, 'getIntegration')
                .callsFake(() => Promise.resolve(createResponse(mockIntegration)));

            return executeTest(client.integrations, 'get', [mockIntegration.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockIntegration)));
                expect(client._internalClient.getIntegration).to.have.callCount(1);
                expect(client._internalClient.getIntegration).to.have.been.calledWith(mockIntegration.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when Integration not found', async function() {
            const id = v4();
            sinon
                .stub(client._internalClient, 'getIntegration')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.integrations, 'get', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client._internalClient.getIntegration).to.have.callCount(1);
                expect(client._internalClient.getIntegration).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Find Integrations', function() {
        it('should find Integrations with no filter options', async function() {
            const mockIntegrationsPage = mock.mockIntegrationsPage();
            sinon
                .stub(client._internalClient, 'findIntegrations')
                .callsFake(() => Promise.resolve(createResponse(mockIntegrationsPage)));

            return executeTest(client.integrations, 'find', [], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockIntegrationsPage)));
                expect(client._internalClient.findIntegrations).to.have.callCount(1);
                expect(client._internalClient.findIntegrations).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should find Integrations with filter options', async function() {
            const options = { pageSize: 3, query: 'some table' };
            const mockIntegrationsPage = mock.mockIntegrationsPage();
            sinon
                .stub(client._internalClient, 'findIntegrations')
                .callsFake(() => Promise.resolve(createResponse(mockIntegrationsPage)));

            return executeTest(client.integrations, 'find', [options], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockIntegrationsPage)));
                expect(client._internalClient.findIntegrations).to.have.callCount(1);
                expect(client._internalClient.findIntegrations).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders,
                    ...options
                });
            });
        });

        it('should return exception when bad response code returned', async function() {
            sinon
                .stub(client._internalClient, 'findIntegrations')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

            return executeTest(client.integrations, 'find', [], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional bad request error');
                expect(client._internalClient.findIntegrations).to.have.callCount(1);
                expect(client._internalClient.findIntegrations).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Delete Integration', function() {
        it('should delete Integration by ID', async function() {
            const mockIntegration = mock.mockIntegration();
            sinon
                .stub(client._internalClient, 'deleteIntegration')
                .callsFake(() => Promise.resolve(createResponse(mockIntegration)));

            return executeTest(client.integrations, 'delete', [mockIntegration.id], err => {
                expect(err).to.not.be.ok;

                expect(client._internalClient.deleteIntegration).to.have.callCount(1);
                expect(client._internalClient.deleteIntegration).to.have.been.calledWith(mockIntegration.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when Integration not found', async function() {
            const id = v4();
            sinon
                .stub(client._internalClient, 'deleteIntegration')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.integrations, 'delete', [id], error => {
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client._internalClient.deleteIntegration).to.have.callCount(1);
                expect(client._internalClient.deleteIntegration).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Create Integration', function() {
        it('should create a new Integration with a single IntegrationCreationRequest', function() {
            const mockIntegration = mock.mockIntegration();
            const request = new IntegrationCreationRequest();
            request.name = mockIntegration.name;
            request.config = mock.mockIntegrationConfiguration();
            sinon
                .stub(client._internalClient, 'createIntegration')
                .callsFake(() => Promise.resolve(createResponse(mockIntegration)));

            return executeTest(client.integrations, 'create', [request], (error, result) => {
                expect(error).to.not.be.ok;

                expect(result).to.deep.equal(mockIntegration);
                expect(client._internalClient.createIntegration).to.have.callCount(1);
                expect(client._internalClient.createIntegration).to.have.been.calledWith({
                    ...request,
                    customHeaders: expectedCustomHeaders
                });
            });
        });
        it('should create a new Integration with a name and an IntegrationConfiguration', function() {
            const mockIntegration = mock.mockIntegration();
            const name = mockIntegration.name;
            const config = mock.mockIntegrationConfiguration();
            sinon
                .stub(client._internalClient, 'createIntegration')
                .callsFake(() => Promise.resolve(createResponse(mockIntegration)));

            return executeTest(client.integrations, 'create', [name, config], (error, result) => {
                expect(error).to.not.be.ok;

                expect(result).to.deep.equal(mockIntegration);
                expect(client._internalClient.createIntegration).to.have.callCount(1);
                expect(client._internalClient.createIntegration).to.have.been.calledWith({
                    name,
                    config,
                    customHeaders: expectedCustomHeaders
                });
            });
        });
        it('should return proper exception when error returned', async function() {
            const request = new IntegrationCreationRequest();
            request.name = v4();
            request.config = mock.mockIntegrationConfiguration();
            sinon
                .stub(client._internalClient, 'createIntegration')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional forbidden error' }, 401)));

            return executeTest(client.integrations, 'create', [request], error => {
                expect(error).to.be.ok.and.to.be.instanceOf(UnauthorizedError);
                expect(error.message).to.include('Intentional forbidden error');
                expect(client._internalClient.createIntegration).to.have.callCount(1);
                expect(client._internalClient.createIntegration).to.have.been.calledWith({
                    ...request,
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Update Integration', function() {
        it('should update a new Integration with a single IntegrationUpdateRequest', function() {
            const mockIntegration = mock.mockIntegration();
            const request = new IntegrationUpdateRequest();
            request.name = mockIntegration.name;
            request.config = mock.mockIntegrationConfiguration();
            sinon
                .stub(client._internalClient, 'updateIntegration')
                .callsFake(() => Promise.resolve(createResponse(mockIntegration)));

            return executeTest(client.integrations, 'update', [mockIntegration.id, request], (error, result) => {
                expect(error).to.not.be.ok;

                expect(result).to.deep.equal(mockIntegration);
                expect(client._internalClient.updateIntegration).to.have.callCount(1);
                expect(client._internalClient.updateIntegration).to.have.been.calledWith(mockIntegration.id, {
                    ...request,
                    customHeaders: expectedCustomHeaders
                });
            });
        });
        it('should update a new Integration with a name and an IntegrationConfiguration', function() {
            const mockIntegration = mock.mockIntegration();
            const name = mockIntegration.name;
            const config = mock.mockIntegrationConfiguration();
            sinon
                .stub(client._internalClient, 'updateIntegration')
                .callsFake(() => Promise.resolve(createResponse(mockIntegration)));

            return executeTest(client.integrations, 'update', [mockIntegration.id, name, config], (error, result) => {
                expect(error).to.not.be.ok;

                expect(result).to.deep.equal(mockIntegration);
                expect(client._internalClient.updateIntegration).to.have.callCount(1);
                expect(client._internalClient.updateIntegration).to.have.been.calledWith(mockIntegration.id, {
                    name,
                    config,
                    customHeaders: expectedCustomHeaders
                });
            });
        });
        it('should return proper exception when error returned', async function() {
            const id = v4();
            const request = new IntegrationCreationRequest();
            request.name = v4();
            request.config = mock.mockIntegrationConfiguration();
            sinon
                .stub(client._internalClient, 'updateIntegration')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional forbidden error' }, 401)));

            return executeTest(client.integrations, 'update', [id, request], error => {
                expect(error).to.be.ok.and.to.be.instanceOf(UnauthorizedError);
                expect(error.message).to.include('Intentional forbidden error');
                expect(client._internalClient.updateIntegration).to.have.callCount(1);
                expect(client._internalClient.updateIntegration).to.have.been.calledWith(id, {
                    ...request,
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Get Integration Connection', function() {
        it('should get an Integration Connection by ID', async function() {
            const mockIntegrationConnection = mock.mockIntegrationConnection();
            sinon
                .stub(client._internalClient, 'getIntegrationConnection')
                .callsFake(() => Promise.resolve(createResponse(mockIntegrationConnection)));

            return executeTest(client.integrations, 'getConnection', [mockIntegrationConnection.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockIntegrationConnection)));
                expect(client._internalClient.getIntegrationConnection).to.have.callCount(1);
                expect(client._internalClient.getIntegrationConnection).to.have.been.calledWith(
                    '-',
                    mockIntegrationConnection.id,
                    {
                        customHeaders: expectedCustomHeaders
                    }
                );
            });
        });

        it('should return proper exception when Integration not found', async function() {
            const id = v4();
            sinon
                .stub(client._internalClient, 'getIntegrationConnection')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.integrations, 'getConnection', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client._internalClient.getIntegrationConnection).to.have.callCount(1);
                expect(client._internalClient.getIntegrationConnection).to.have.been.calledWith('-', id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Create Integration Connection', function() {
        it('should create a new Integration Connection', function() {
            const mockIntegration = mock.mockIntegration();
            mockIntegration.connectionParams = [
                { name: 'Param1', referenceName: 'param1', fieldType: 'string' as FieldType }
            ];
            const mockConnection = mock.mockIntegrationConnection(mockIntegration.id);
            const name = mockConnection.name;
            const params = [{ name: 'param1', value: 'test value' }];

            sinon
                .stub(client._internalClient, 'getIntegration')
                .callsFake(() => Promise.resolve(createResponse(mockIntegration)));
            sinon
                .stub(client._internalClient, 'createIntegrationConnection')
                .callsFake(() => Promise.resolve(createResponse(mockConnection)));

            return executeTest(
                client.integrations,
                'createConnection',
                [mockIntegration.id, name, params],
                (error, result) => {
                    expect(error).to.not.be.ok;

                    expect(result).to.deep.equal(mockConnection);
                    expect(client._internalClient.getIntegration).to.have.callCount(1);
                    expect(client._internalClient.getIntegration).to.have.been.calledWith(mockIntegration.id, {
                        customHeaders: expectedCustomHeaders
                    });
                    expect(client._internalClient.createIntegrationConnection).to.have.callCount(1);
                    expect(client._internalClient.createIntegrationConnection).to.have.been.calledWith(
                        mockIntegration.id,
                        {
                            body: {
                                integrationId: mockIntegration.id,
                                name,
                                connectionParams: [{ name: 'Param1', referenceName: 'param1', value: 'test value' }]
                            },
                            customHeaders: expectedCustomHeaders
                        }
                    );
                }
            );
        });
        it('should return error if invalid param provided', async function() {
            const mockIntegration = mock.mockIntegration();
            mockIntegration.connectionParams = [
                { name: 'Param1', referenceName: 'param1', fieldType: 'string' as FieldType }
            ];
            const integrationId = mockIntegration.id;
            const name = v4();
            const params = [{ name: 'fake param', value: 'test value' }];
            sinon
                .stub(client._internalClient, 'getIntegration')
                .callsFake(() => Promise.resolve(createResponse(mockIntegration)));
            sinon.spy(client._internalClient, 'createIntegrationConnection');

            return executeTest(client.integrations, 'createConnection', [integrationId, name, params], error => {
                expect(error).to.be.ok.and.to.be.instanceOf(FieldInputError);
                expect(client._internalClient.getIntegration).to.have.callCount(1);
                expect(client._internalClient.getIntegration).to.have.been.calledWith(mockIntegration.id, {
                    customHeaders: expectedCustomHeaders
                });
                expect(client._internalClient.createIntegrationConnection).to.not.have.been.called;
            });
        });
        it('should return proper exception when error returned', async function() {
            const mockIntegration = mock.mockIntegration();
            mockIntegration.connectionParams = [
                { name: 'Param1', referenceName: 'param1', fieldType: 'string' as FieldType }
            ];
            const integrationId = mockIntegration.id;
            const name = v4();
            const params = [{ name: 'param1', value: 'test value' }];
            sinon
                .stub(client._internalClient, 'getIntegration')
                .callsFake(() => Promise.resolve(createResponse(mockIntegration)));
            sinon
                .stub(client._internalClient, 'createIntegrationConnection')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional forbidden error' }, 401)));

            return executeTest(client.integrations, 'createConnection', [integrationId, name, params], error => {
                expect(error).to.be.ok.and.to.be.instanceOf(UnauthorizedError);
                expect(error.message).to.include('Intentional forbidden error');
                expect(client._internalClient.getIntegration).to.have.callCount(1);
                expect(client._internalClient.getIntegration).to.have.been.calledWith(mockIntegration.id, {
                    customHeaders: expectedCustomHeaders
                });
                expect(client._internalClient.createIntegrationConnection).to.have.callCount(1);
                expect(client._internalClient.createIntegrationConnection).to.have.been.calledWith(integrationId, {
                    body: {
                        integrationId,
                        name,
                        connectionParams: [{ name: 'Param1', referenceName: 'param1', value: 'test value' }]
                    },
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Delete Integration Connection', function() {
        it('should delete Integration by ID', async function() {
            const mockIntegrationConnection = mock.mockIntegrationConnection();
            sinon
                .stub(client._internalClient, 'deleteIntegrationConnection')
                .callsFake(() => Promise.resolve(createResponse(mockIntegrationConnection)));

            return executeTest(client.integrations, 'deleteConnection', [mockIntegrationConnection.id], err => {
                expect(err).to.not.be.ok;

                expect(client._internalClient.deleteIntegrationConnection).to.have.callCount(1);
                expect(client._internalClient.deleteIntegrationConnection).to.have.been.calledWith(
                    '-',
                    mockIntegrationConnection.id,
                    {
                        customHeaders: expectedCustomHeaders
                    }
                );
            });
        });

        it('should return proper exception when Integration Connection not found', async function() {
            const id = v4();
            sinon
                .stub(client._internalClient, 'deleteIntegrationConnection')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.integrations, 'deleteConnection', [id], error => {
                expect(error).to.be.ok;
                expect(error.message)
                    .to.include('Integration Connection')
                    .and.to.include('Intentional not found error');
                expect(client._internalClient.deleteIntegrationConnection).to.have.callCount(1);
                expect(client._internalClient.deleteIntegrationConnection).to.have.been.calledWith('-', id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });
});
