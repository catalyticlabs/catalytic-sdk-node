import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';
import { createResponse, executeTest } from '../helpers';

describe('WorkflowClient', function() {
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

    describe('Get Workflow', function() {
        it('should get a Workflow by ID', function() {
            const mockWorkflow = mock.mockWorkflow();
            sinon
                .stub(client.internalClient, 'getWorkflow')
                .callsFake(() => Promise.resolve(createResponse(mockWorkflow)));

            return executeTest(client.workflowClient, 'get', [mockWorkflow.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockWorkflow)));
                expect(client.internalClient.getWorkflow).to.have.callCount(1);
                expect(client.internalClient.getWorkflow).to.have.been.calledWith(mockWorkflow.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when Workflow not found', function() {
            const id = v4();
            sinon
                .stub(client.internalClient, 'getWorkflow')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.workflowClient, 'get', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client.internalClient.getWorkflow).to.have.callCount(1);
                expect(client.internalClient.getWorkflow).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Find Workflows', function() {
        it('should find Instances with no filter options', function() {
            const mockWorkflowsPage = mock.mockWorkflowsPage();
            sinon
                .stub(client.internalClient, 'findWorkflows')
                .callsFake(() => Promise.resolve(createResponse(mockWorkflowsPage)));

            return executeTest(client.workflowClient, 'find', [], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockWorkflowsPage)));
                expect(client.internalClient.findWorkflows).to.have.callCount(1);
                expect(client.internalClient.findWorkflows).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should find Instances with filter options', function() {
            const mockWorkflowsPage = mock.mockWorkflowsPage();
            const options = { pageSize: 3, query: 'some workflow', owner: 'test@example.com' };
            sinon
                .stub(client.internalClient, 'findWorkflows')
                .callsFake(() => Promise.resolve(createResponse(mockWorkflowsPage)));

            return executeTest(client.workflowClient, 'find', [options], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockWorkflowsPage)));
                expect(client.internalClient.findWorkflows).to.have.callCount(1);
                expect(client.internalClient.findWorkflows).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders,
                    ...options
                });
            });
        });

        it('should return exception when bad response code returned', function() {
            sinon
                .stub(client.internalClient, 'findWorkflows')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

            return executeTest(client.workflowClient, 'find', [], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional bad request error');
                expect(client.internalClient.findWorkflows).to.have.callCount(1);
                expect(client.internalClient.findWorkflows).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });
});
