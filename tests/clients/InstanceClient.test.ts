import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';
import { createResponse, executeTest } from '../helpers';

describe('InstanceClient', function() {
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

    describe('Get Instance', function() {
        it('should get an Instance by ID', function() {
            const mockInstance = mock.mockInstance();
            sinon
                .stub(client.internalClient, 'getInstance')
                .callsFake(() => Promise.resolve(createResponse(mockInstance)));

            return executeTest(client.instanceClient, 'get', [mockInstance.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                expect(client.internalClient.getInstance).to.have.callCount(1);
                expect(client.internalClient.getInstance).to.have.been.calledWith(mockInstance.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when Instance not found', function() {
            const id = v4();
            sinon
                .stub(client.internalClient, 'getInstance')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.instanceClient, 'get', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client.internalClient.getInstance).to.have.callCount(1);
                expect(client.internalClient.getInstance).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Find Instances', function() {
        it('should find Instances with no filter options', function() {
            const mockInstancesPage = mock.mockInstancesPage();
            sinon
                .stub(client.internalClient, 'findInstances')
                .callsFake(() => Promise.resolve(createResponse(mockInstancesPage)));

            return executeTest(client.instanceClient, 'find', [], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstancesPage)));
                expect(client.internalClient.findInstances).to.have.callCount(1);
                expect(client.internalClient.findInstances).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders,
                    ...client.instanceClient.formatFindInstanceOptions({})
                });
            });
        });

        it('should find Instances with filter options', function() {
            const mockInstancesPage = mock.mockInstancesPage();
            const options = { pageSize: 3, query: 'some user', owner: 'test@example.com', workflowID: v4() };
            sinon
                .stub(client.internalClient, 'findInstances')
                .callsFake(() => Promise.resolve(createResponse(mockInstancesPage)));

            return executeTest(client.instanceClient, 'find', [options], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstancesPage)));
                expect(client.internalClient.findInstances).to.have.callCount(1);
                expect(client.internalClient.findInstances).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders,
                    ...client.instanceClient.formatFindInstanceOptions(options)
                });
            });
        });

        it('should return exception when bad response code returned', function() {
            sinon
                .stub(client.internalClient, 'findInstances')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

            return executeTest(client.instanceClient, 'find', [], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional bad request error');
                expect(client.internalClient.findInstances).to.have.callCount(1);
                expect(client.internalClient.findInstances).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders,
                    ...client.instanceClient.formatFindInstanceOptions({})
                });
            });
        });
    });
});
