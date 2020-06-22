import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import { WildcardId } from '../../src/constants';
import { displayNameToInternal } from '../../src/utils';

import mock from '../helpers/mockEntities';
import { createResponse, executeTest } from '../helpers';
import { FieldInputError } from '../../src/errors';

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
                    category: undefined,
                    owner: undefined,
                    pageSize: undefined,
                    pageToken: undefined,
                    processId: undefined,
                    query: undefined
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
                    category: undefined,
                    owner: options.owner,
                    pageSize: options.pageSize,
                    pageToken: undefined,
                    processId: options.workflowID,
                    query: options.query
                });
            });
        });

        it('should throw error when bad response code returned', function() {
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
                    category: undefined,
                    owner: undefined,
                    pageSize: undefined,
                    pageToken: undefined,
                    processId: undefined,
                    query: undefined
                });
            });
        });
    });

    describe('Stop Instance', function() {
        it('should stop an Instance by ID', function() {
            const mockInstance = mock.mockInstance();
            sinon
                .stub(client.internalClient, 'stopInstance')
                .callsFake(() => Promise.resolve(createResponse(mockInstance)));

            return executeTest(client.instanceClient, 'stop', [mockInstance.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                expect(client.internalClient.stopInstance).to.have.callCount(1);
                expect(client.internalClient.stopInstance).to.have.been.calledWith(mockInstance.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when Instance not found', function() {
            const id = v4();
            sinon
                .stub(client.internalClient, 'stopInstance')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.instanceClient, 'stop', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client.internalClient.stopInstance).to.have.callCount(1);
                expect(client.internalClient.stopInstance).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Start Instance', function() {
        it('should start an instance with no name or inputs', function() {
            const workflowID = v4();
            const mockInstance = mock.mockInstance();
            sinon
                .stub(client.internalClient, 'startInstance')
                .callsFake(() => Promise.resolve(createResponse(mockInstance)));

            return executeTest(client.instanceClient, 'start', [workflowID], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                expect(client.internalClient.startInstance).to.have.callCount(1);
                expect(client.internalClient.startInstance).to.have.been.calledWith({
                    body: {
                        workflowId: workflowID,
                        inputFields: null,
                        name: null
                    },
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should start an instance with name', function() {
            const workflowID = v4();
            const name = 'test instance name';
            const mockInstance = mock.mockInstance();
            sinon
                .stub(client.internalClient, 'startInstance')
                .callsFake(() => Promise.resolve(createResponse(mockInstance)));

            return executeTest(client.instanceClient, 'start', [workflowID, name], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                expect(client.internalClient.startInstance).to.have.callCount(1);
                expect(client.internalClient.startInstance).to.have.been.calledWith({
                    body: {
                        workflowId: workflowID,
                        name,
                        inputFields: null
                    },
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should start an instance with inputs', function() {
            const workflowID = v4();
            const inputs = [
                { name: 'My Field', value: 'some value' },
                { name: 'Another Field', value: 'second value' }
            ];
            const mockInstance = mock.mockInstance();
            sinon
                .stub(client.internalClient, 'startInstance')
                .callsFake(() => Promise.resolve(createResponse(mockInstance)));

            return executeTest(client.instanceClient, 'start', [workflowID, inputs], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                expect(client.internalClient.startInstance).to.have.callCount(1);
                expect(client.internalClient.startInstance).to.have.been.calledWith({
                    body: {
                        workflowId: workflowID,
                        inputFields: inputs.map(f => ({ ...f, referenceName: displayNameToInternal(f.name) })),
                        name: null
                    },
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should start an instance with name and inputs', function() {
            const workflowID = v4();
            const name = 'test instance name';
            const inputs = [
                { name: 'My Field', value: 'some value' },
                { name: 'Another Field', value: 'second value' }
            ];
            const mockInstance = mock.mockInstance();
            sinon
                .stub(client.internalClient, 'startInstance')
                .callsFake(() => Promise.resolve(createResponse(mockInstance)));

            return executeTest(client.instanceClient, 'start', [workflowID, name, inputs], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                expect(client.internalClient.startInstance).to.have.callCount(1);
                expect(client.internalClient.startInstance).to.have.been.calledWith({
                    body: {
                        workflowId: workflowID,
                        inputFields: inputs.map(f => ({ ...f, referenceName: displayNameToInternal(f.name) })),
                        name
                    },
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should throw proper error when invalid inputs passed', async function() {
            const workflowID = v4();
            const name = 'test instance name';
            sinon
                .stub(client.internalClient, 'startInstance')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

            await executeTest(
                client.instanceClient,
                'start',
                [workflowID, name, { name: 'My Field', value: 'some value' }],
                (err, result) => {
                    expect(result).to.not.be.ok;
                    expect(err).to.be.ok.and.to.be.instanceOf(FieldInputError);
                    expect(err.message).to.include('Fields must be an Array of FieldInput objects');
                    expect(client.internalClient.startInstance).to.have.callCount(0);
                }
            );

            await executeTest(
                client.instanceClient,
                'start',
                [workflowID, name, [{ value: 'some value' }]],
                (err, result) => {
                    expect(result).to.not.be.ok;
                    expect(err).to.be.ok.and.to.be.instanceOf(FieldInputError);
                    expect(err.message).to.include('No name or reference name provided for field at index 0');
                    expect(client.internalClient.startInstance).to.have.callCount(0);
                }
            );
        });

        it('should throw proper error when Instance start request fails', function() {
            const workflowID = v4();
            const name = 'test instance name';
            const inputs = [
                { name: 'My Field', value: 'some value' },
                { name: 'Another Field', value: 'second value' }
            ];
            sinon
                .stub(client.internalClient, 'startInstance')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

            return executeTest(client.instanceClient, 'start', [workflowID, name, inputs], (err, result) => {
                expect(result).to.not.be.ok;
                expect(err).to.be.ok;
                expect(err.message).to.include('Intentional bad request error');
                expect(client.internalClient.startInstance).to.have.callCount(1);
                expect(client.internalClient.startInstance).to.have.been.calledWith({
                    body: {
                        workflowId: workflowID,
                        inputFields: inputs.map(f => ({ ...f, referenceName: displayNameToInternal(f.name) })),
                        name
                    },
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('InstanceSteps', function() {
        describe('Get InstanceStep', function() {
            it('should get an InstanceStep by ID', function() {
                const mockInstanceStep = mock.mockInstanceStep();
                sinon
                    .stub(client.internalClient, 'getInstanceStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));

                return executeTest(client.instanceClient, 'getInstanceStep', [mockInstanceStep.id], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStep)));
                    expect(client.internalClient.getInstanceStep).to.have.callCount(1);
                    expect(client.internalClient.getInstanceStep).to.have.been.calledWith(
                        mockInstanceStep.id,
                        WildcardId,
                        {
                            customHeaders: expectedCustomHeaders
                        }
                    );
                });
            });

            it('should return proper exception when Instance not found', function() {
                const id = v4();
                sinon
                    .stub(client.internalClient, 'getInstanceStep')
                    .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

                return executeTest(client.instanceClient, 'getInstanceStep', [id], (error, result) => {
                    expect(result).to.not.be.ok;
                    expect(error).to.be.ok;
                    expect(error.message).to.include('Intentional not found error');
                    expect(client.internalClient.getInstanceStep).to.have.callCount(1);
                    expect(client.internalClient.getInstanceStep).to.have.been.calledWith(id, WildcardId, {
                        customHeaders: expectedCustomHeaders
                    });
                });
            });
        });

        describe('Find InstanceSteps', function() {
            it('should find InstanceSteps with no filter options', function() {
                const mockInstanceStepsPage = mock.mockInstanceStepsPage();
                sinon
                    .stub(client.internalClient, 'findInstanceSteps')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStepsPage)));

                return executeTest(client.instanceClient, 'findInstanceSteps', [], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStepsPage)));
                    expect(client.internalClient.findInstanceSteps).to.have.callCount(1);
                    expect(client.internalClient.findInstanceSteps).to.have.been.calledWith(WildcardId, {
                        customHeaders: expectedCustomHeaders,
                        pageSize: undefined,
                        pageToken: undefined,
                        participatingUsers: undefined,
                        processId: undefined,
                        query: undefined,
                        runId: undefined
                    });
                });
            });

            it('should find InstanceSteps with filter options', function() {
                const mockInstanceStepsPage = mock.mockInstanceStepsPage();
                const options = { pageSize: 3, query: 'some user', assignedTo: 'test@example.com', instanceID: v4() };
                sinon
                    .stub(client.internalClient, 'findInstanceSteps')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStepsPage)));

                return executeTest(client.instanceClient, 'findInstanceSteps', [options], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStepsPage)));
                    expect(client.internalClient.findInstanceSteps).to.have.callCount(1);
                    expect(client.internalClient.findInstanceSteps).to.have.been.calledWith(WildcardId, {
                        customHeaders: expectedCustomHeaders,
                        pageSize: options.pageSize,
                        pageToken: undefined,
                        participatingUsers: options.assignedTo,
                        processId: undefined,
                        query: options.query,
                        runId: options.instanceID
                    });
                });
            });

            it('should throw error when bad response code returned', function() {
                sinon
                    .stub(client.internalClient, 'findInstanceSteps')
                    .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

                return executeTest(client.instanceClient, 'findInstanceSteps', [], (error, result) => {
                    expect(result).to.not.be.ok;
                    expect(error).to.be.ok;
                    expect(error.message).to.include('Intentional bad request error');
                    expect(client.internalClient.findInstanceSteps).to.have.callCount(1);
                    expect(client.internalClient.findInstanceSteps).to.have.been.calledWith(WildcardId, {
                        customHeaders: expectedCustomHeaders,
                        pageSize: undefined,
                        pageToken: undefined,
                        participatingUsers: undefined,
                        processId: undefined,
                        query: undefined,
                        runId: undefined
                    });
                });
            });
        });

        describe('Reassign InstanceStep', function() {
            it('should reassign an InstanceStep to a new user', function() {
                const mockInstanceStep = mock.mockInstanceStep();
                const email = 'test@example.com';
                sinon
                    .stub(client.internalClient, 'reassignStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));

                return executeTest(
                    client.instanceClient,
                    'reassignInstanceStep',
                    [mockInstanceStep.id, email],
                    (err, result) => {
                        expect(err).to.not.be.ok;

                        expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStep)));
                        expect(client.internalClient.reassignStep).to.have.callCount(1);
                        expect(client.internalClient.reassignStep).to.have.been.calledWith(
                            mockInstanceStep.id,
                            WildcardId,
                            {
                                customHeaders: expectedCustomHeaders,
                                body: {
                                    id: mockInstanceStep.id,
                                    assignTo: email
                                }
                            }
                        );
                    }
                );
            });

            it('should throw error when bad response code returned', function() {
                const mockInstanceStep = mock.mockInstanceStep();
                const email = 'test@example.com';
                sinon
                    .stub(client.internalClient, 'reassignStep')
                    .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

                return executeTest(
                    client.instanceClient,
                    'reassignInstanceStep',
                    [mockInstanceStep.id, email],
                    (err, result) => {
                        expect(result).to.not.be.ok;
                        expect(err).to.be.ok;
                        expect(err.message).to.include('Intentional bad request error');
                        expect(client.internalClient.reassignStep).to.have.callCount(1);
                        expect(client.internalClient.reassignStep).to.have.been.calledWith(
                            mockInstanceStep.id,
                            WildcardId,
                            {
                                customHeaders: expectedCustomHeaders,
                                body: {
                                    id: mockInstanceStep.id,
                                    assignTo: email
                                }
                            }
                        );
                    }
                );
            });
        });

        describe('Complete InstanceStep', function() {
            it('should complete an InstanceStep without output fields', function() {
                const mockInstanceStep = mock.mockInstanceStep();
                sinon
                    .stub(client.internalClient, 'completeStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));

                return executeTest(
                    client.instanceClient,
                    'completeInstanceStep',
                    [mockInstanceStep.id],
                    (err, result) => {
                        expect(err).to.not.be.ok;

                        expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStep)));
                        expect(client.internalClient.completeStep).to.have.callCount(1);
                        expect(client.internalClient.completeStep).to.have.been.calledWith(
                            mockInstanceStep.id,
                            WildcardId,
                            {
                                customHeaders: expectedCustomHeaders,
                                body: {
                                    id: mockInstanceStep.id,
                                    stepOutputFields: null
                                }
                            }
                        );
                    }
                );
            });

            it('should complete an InstanceStep with output fields', function() {
                const mockInstanceStep = mock.mockInstanceStep();
                const fields = [
                    { name: 'My Field', value: 'some value' },
                    { name: 'Another Field', value: 'second value' }
                ];
                sinon
                    .stub(client.internalClient, 'completeStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));

                return executeTest(
                    client.instanceClient,
                    'completeInstanceStep',
                    [mockInstanceStep.id, fields],
                    (err, result) => {
                        expect(err).to.not.be.ok;

                        expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStep)));
                        expect(client.internalClient.completeStep).to.have.callCount(1);
                        expect(client.internalClient.completeStep).to.have.been.calledWith(
                            mockInstanceStep.id,
                            WildcardId,
                            {
                                customHeaders: expectedCustomHeaders,
                                body: {
                                    id: mockInstanceStep.id,
                                    stepOutputFields: fields.map(f => ({
                                        ...f,
                                        referenceName: displayNameToInternal(f.name)
                                    }))
                                }
                            }
                        );
                    }
                );
            });

            it('should throw error when bad status code returned', function() {
                const mockInstanceStep = mock.mockInstanceStep();
                const fields = [
                    { name: 'My Field', value: 'some value' },
                    { name: 'Another Field', value: 'second value' }
                ];
                sinon
                    .stub(client.internalClient, 'completeStep')
                    .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

                return executeTest(
                    client.instanceClient,
                    'completeInstanceStep',
                    [mockInstanceStep.id, fields],
                    (err, result) => {
                        expect(result).to.not.be.ok;
                        expect(err).to.be.ok;
                        expect(err.message).to.include('Intentional bad request error');
                        expect(client.internalClient.completeStep).to.have.callCount(1);
                        expect(client.internalClient.completeStep).to.have.been.calledWith(
                            mockInstanceStep.id,
                            WildcardId,
                            {
                                customHeaders: expectedCustomHeaders,
                                body: {
                                    id: mockInstanceStep.id,
                                    stepOutputFields: fields.map(f => ({
                                        ...f,
                                        referenceName: displayNameToInternal(f.name)
                                    }))
                                }
                            }
                        );
                    }
                );
            });
        });
    });
});
