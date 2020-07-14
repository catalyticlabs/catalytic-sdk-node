import Bluebird from 'bluebird';
import chai from 'chai';
import { join } from 'path';
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
import { FieldType } from '../../src/internal/lib/models';
import { FileMetadataPage } from '../../src/entities';

describe('InstanceClient', function() {
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

    describe('Get Instance', function() {
        it('should get an Instance by ID', function() {
            const mockInstance = mock.mockInstance();
            sinon
                .stub(client._internalClient, 'getInstance')
                .callsFake(() => Promise.resolve(createResponse(mockInstance)));

            return executeTest(client.instances, 'get', [mockInstance.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                expect(client._internalClient.getInstance).to.have.callCount(1);
                expect(client._internalClient.getInstance).to.have.been.calledWith(mockInstance.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when Instance not found', function() {
            const id = v4();
            sinon
                .stub(client._internalClient, 'getInstance')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.instances, 'get', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client._internalClient.getInstance).to.have.callCount(1);
                expect(client._internalClient.getInstance).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Find Instances', function() {
        it('should find Instances with no filter options', function() {
            const mockInstancesPage = mock.mockInstancesPage();
            sinon
                .stub(client._internalClient, 'findInstances')
                .callsFake(() => Promise.resolve(createResponse(mockInstancesPage)));

            return executeTest(client.instances, 'find', [], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstancesPage)));
                expect(client._internalClient.findInstances).to.have.callCount(1);
                expect(client._internalClient.findInstances).to.have.been.calledWith({
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
                .stub(client._internalClient, 'findInstances')
                .callsFake(() => Promise.resolve(createResponse(mockInstancesPage)));

            return executeTest(client.instances, 'find', [options], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstancesPage)));
                expect(client._internalClient.findInstances).to.have.callCount(1);
                expect(client._internalClient.findInstances).to.have.been.calledWith({
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
                .stub(client._internalClient, 'findInstances')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

            return executeTest(client.instances, 'find', [], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional bad request error');
                expect(client._internalClient.findInstances).to.have.callCount(1);
                expect(client._internalClient.findInstances).to.have.been.calledWith({
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
                .stub(client._internalClient, 'stopInstance')
                .callsFake(() => Promise.resolve(createResponse(mockInstance)));

            return executeTest(client.instances, 'stop', [mockInstance.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                expect(client._internalClient.stopInstance).to.have.callCount(1);
                expect(client._internalClient.stopInstance).to.have.been.calledWith(mockInstance.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when Instance not found', function() {
            const id = v4();
            sinon
                .stub(client._internalClient, 'stopInstance')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.instances, 'stop', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client._internalClient.stopInstance).to.have.callCount(1);
                expect(client._internalClient.stopInstance).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Start Instance', function() {
        it('should start an instance with no name or inputs', function() {
            const workflow = mock.mockWorkflow();
            const workflowID = workflow.id;
            const mockInstance = mock.mockInstance();
            sinon
                .stub(client._internalClient, 'getWorkflow')
                .callsFake(() => Promise.resolve(createResponse(workflow)));
            sinon
                .stub(client._internalClient, 'startInstance')
                .callsFake(() => Promise.resolve(createResponse(mockInstance)));

            return executeTest(client.instances, 'start', [workflowID], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                expect(client._internalClient.getWorkflow).to.have.callCount(1);
                expect(client._internalClient.getWorkflow).to.have.been.calledWith(workflowID, {
                    customHeaders: expectedCustomHeaders
                });
                expect(client._internalClient.startInstance).to.have.callCount(1);
                expect(client._internalClient.startInstance).to.have.been.calledWith({
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
            const workflow = mock.mockWorkflow();
            const workflowID = workflow.id;
            const mockInstance = mock.mockInstance();
            sinon
                .stub(client._internalClient, 'getWorkflow')
                .callsFake(() => Promise.resolve(createResponse(workflow)));
            sinon
                .stub(client._internalClient, 'startInstance')
                .callsFake(() => Promise.resolve(createResponse(mockInstance)));
            const name = 'test instance name';

            return executeTest(client.instances, 'start', [workflowID, name], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                expect(client._internalClient.getWorkflow).to.have.callCount(1);
                expect(client._internalClient.getWorkflow).to.have.been.calledWith(workflowID, {
                    customHeaders: expectedCustomHeaders
                });
                expect(client._internalClient.startInstance).to.have.callCount(1);
                expect(client._internalClient.startInstance).to.have.been.calledWith({
                    body: {
                        workflowId: workflowID,
                        name,
                        inputFields: null
                    },
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        describe('with inputs', function() {
            it('should start an instance with inputs', function() {
                const workflow = mock.mockWorkflow();
                workflow.inputFields = [
                    { name: 'My Field', fieldType: 'text' },
                    { name: 'Another Field', fieldType: 'text' }
                ];
                const workflowID = workflow.id;
                const mockInstance = mock.mockInstance();
                sinon
                    .stub(client._internalClient, 'getWorkflow')
                    .callsFake(() => Promise.resolve(createResponse(workflow)));
                sinon
                    .stub(client._internalClient, 'startInstance')
                    .callsFake(() => Promise.resolve(createResponse(mockInstance)));
                const inputs = [
                    { name: 'My Field', value: 'some value' },
                    { name: 'Another Field', value: '' }
                ];

                return executeTest(client.instances, 'start', [workflowID, inputs], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                    expect(client._internalClient.getWorkflow).to.have.callCount(1);
                    expect(client._internalClient.getWorkflow).to.have.been.calledWith(workflowID, {
                        customHeaders: expectedCustomHeaders
                    });
                    expect(client._internalClient.startInstance).to.have.callCount(1);
                    expect(client._internalClient.startInstance).to.have.been.calledWith({
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
                const workflow = mock.mockWorkflow();
                workflow.inputFields = [
                    { name: 'My Field', fieldType: 'text' },
                    { name: 'Another Field', fieldType: 'table' },
                    { name: 'Instance Field', fieldType: 'instance' },
                    { name: 'Workflow Field', fieldType: 'workflow' },
                    { name: 'User Field', fieldType: 'user' }
                ];
                const workflowID = workflow.id;
                const mockInstance = mock.mockInstance();
                sinon
                    .stub(client._internalClient, 'getWorkflow')
                    .callsFake(() => Promise.resolve(createResponse(workflow)));
                sinon
                    .stub(client._internalClient, 'startInstance')
                    .callsFake(() => Promise.resolve(createResponse(mockInstance)));
                const name = 'test instance name';
                const inputs = [
                    { name: 'My Field', value: 'some value' },
                    { name: 'Another Field', value: v4() },
                    { name: 'Instance Field', value: v4() },
                    { name: 'Workflow Field', value: v4() },
                    { name: 'User Field', value: v4() }
                ];

                return executeTest(client.instances, 'start', [workflowID, name, inputs], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                    expect(client._internalClient.getWorkflow).to.have.callCount(1);
                    expect(client._internalClient.getWorkflow).to.have.been.calledWith(workflowID, {
                        customHeaders: expectedCustomHeaders
                    });
                    expect(client._internalClient.startInstance).to.have.callCount(1);
                    expect(client._internalClient.startInstance).to.have.been.calledWith({
                        body: {
                            workflowId: workflowID,
                            inputFields: inputs.map(f => ({ ...f, referenceName: displayNameToInternal(f.name) })),
                            name
                        },
                        customHeaders: expectedCustomHeaders
                    });
                });
            });

            it('should automatically upload a file input if a path is provided', function() {
                const filePath = join(__dirname, '../fixtures/test.txt');
                const mockFileMetadata = mock.mockFileMetadata();
                // stubbing protected method on BaseClient, which is called by FileClient.upload
                const stub = sinon.stub(client.instances, 'uploadFile' as any).callsFake(() => {
                    const result = new FileMetadataPage();
                    result.files = [mockFileMetadata];
                    return Promise.resolve(result);
                });

                const workflow = mock.mockWorkflow();
                workflow.inputFields = [{ referenceName: 'my-field', fieldType: 'file' }];
                const workflowID = workflow.id;
                const mockInstance = mock.mockInstance();
                sinon
                    .stub(client._internalClient, 'getWorkflow')
                    .callsFake(() => Promise.resolve(createResponse(workflow)));
                sinon
                    .stub(client._internalClient, 'startInstance')
                    .callsFake(() => Promise.resolve(createResponse(mockInstance)));
                const name = 'test instance name';
                const inputs = [{ referenceName: 'my-field', value: filePath }];

                return executeTest(client.instances, 'start', [workflowID, name, inputs], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                    expect(client._internalClient.getWorkflow).to.have.callCount(1);
                    expect(client._internalClient.getWorkflow).to.have.been.calledWith(workflowID, {
                        customHeaders: expectedCustomHeaders
                    });
                    expect(stub).to.have.callCount(1);
                    expect(stub).to.have.been.calledWith(filePath);
                    expect(client._internalClient.startInstance).to.have.callCount(1);
                    expect(client._internalClient.startInstance).to.have.been.calledWith({
                        body: {
                            workflowId: workflowID,
                            inputFields: [{ name: undefined, referenceName: 'my-field', value: mockFileMetadata.id }],
                            name
                        },
                        customHeaders: expectedCustomHeaders
                    });
                });
            });

            it('should passthrough fileID in file input if the value is a UUID', function() {
                const mockFileMetadata = mock.mockFileMetadata();
                const stub = sinon.stub(client.instances, 'uploadFile' as any);

                const workflow = mock.mockWorkflow();
                workflow.inputFields = [{ name: 'My Field', fieldType: 'file' }];
                const workflowID = workflow.id;
                const mockInstance = mock.mockInstance();
                sinon
                    .stub(client._internalClient, 'getWorkflow')
                    .callsFake(() => Promise.resolve(createResponse(workflow)));
                sinon
                    .stub(client._internalClient, 'startInstance')
                    .callsFake(() => Promise.resolve(createResponse(mockInstance)));
                const name = 'test instance name';
                const inputs = [{ name: 'My Field', value: mockFileMetadata.id }];

                return executeTest(client.instances, 'start', [workflowID, name, inputs], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstance)));
                    expect(client._internalClient.getWorkflow).to.have.callCount(1);
                    expect(client._internalClient.getWorkflow).to.have.been.calledWith(workflowID, {
                        customHeaders: expectedCustomHeaders
                    });
                    expect(stub).to.have.callCount(0);
                    expect(client._internalClient.startInstance).to.have.callCount(1);
                    expect(client._internalClient.startInstance).to.have.been.calledWith({
                        body: {
                            workflowId: workflowID,
                            inputFields: [{ name: 'My Field', referenceName: 'my-field', value: mockFileMetadata.id }],
                            name
                        },
                        customHeaders: expectedCustomHeaders
                    });
                });
            });

            it('should throw proper error when invalid inputs passed', async function() {
                const workflow = mock.mockWorkflow();
                workflow.inputFields = [
                    { name: 'My Field', fieldType: 'text' },
                    { name: 'Another Field', fieldType: 'text' }
                ];
                const workflowID = workflow.id;
                sinon
                    .stub(client._internalClient, 'getWorkflow')
                    .callsFake(() => Promise.resolve(createResponse(workflow)));
                sinon
                    .stub(client._internalClient, 'startInstance')
                    .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));
                const name = 'test instance name';

                await executeTest(
                    client.instances,
                    'start',
                    [workflowID, name, { name: 'My Field', value: 'some value' }],
                    (err, result) => {
                        expect(result).to.not.be.ok;
                        expect(err).to.be.ok.and.to.be.instanceOf(FieldInputError);
                        expect(err.message).to.include('Fields must be an Array of FieldInput objects');
                        expect(client._internalClient.startInstance).to.have.callCount(0);
                    }
                );

                await executeTest(
                    client.instances,
                    'start',
                    [workflowID, name, [{ value: 'some value' }]],
                    (err, result) => {
                        expect(result).to.not.be.ok;
                        expect(err).to.be.ok.and.to.be.instanceOf(FieldInputError);
                        expect(err.message).to.include('No name or referenceName provided for FieldInput at index 0');
                        expect(client._internalClient.startInstance).to.have.callCount(0);
                    }
                );

                await executeTest(
                    client.instances,
                    'start',
                    [workflowID, name, [{ referenceName: 'My Field', value: {} }]],
                    (err, result) => {
                        expect(result).to.not.be.ok;
                        expect(err).to.be.ok.and.to.be.instanceOf(FieldInputError);
                        expect(err.message).to.include(`Value for field 'My Field' must be a string`);
                        expect(client._internalClient.startInstance).to.have.callCount(0);
                    }
                );
            });

            it('should throw an error when user/table/instance/workflow field is not a UUID', async function() {
                const stub = sinon.stub(client._internalClient, 'getWorkflow');
                sinon.stub(client._internalClient, 'startInstance');
                await Bluebird.each(['user', 'workflow', 'table', 'instance'], async fieldType => {
                    const workflow = mock.mockWorkflow();
                    workflow.inputFields = [{ name: 'My Field', fieldType: fieldType as FieldType }];
                    const workflowID = workflow.id;
                    const name = 'My New Instance';
                    stub.callsFake(() => Promise.resolve(createResponse(workflow)));

                    await executeTest(
                        client.instances,
                        'start',
                        [workflowID, name, [{ name: 'My Field', value: 'not-a-uuid' }]],
                        (err, result) => {
                            expect(result).to.not.be.ok;
                            expect(err).to.be.ok.and.to.be.instanceOf(FieldInputError);
                            expect(err.message).to.include(
                                `Value 'not-a-uuid' provided for field 'My Field' of type '${fieldType}' is not a valid ID`
                            );
                            expect(client._internalClient.startInstance).to.have.callCount(0);
                        }
                    );
                });
            });

            it('should throw proper error when passed field does not exist on Workflow', function() {
                const workflow = mock.mockWorkflow();
                const workflowID = workflow.id;
                sinon
                    .stub(client._internalClient, 'getWorkflow')
                    .callsFake(() => Promise.resolve(createResponse(workflow)));
                sinon
                    .stub(client._internalClient, 'startInstance')
                    .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));
                const name = 'test instance name';

                return executeTest(
                    client.instances,
                    'start',
                    [workflowID, name, [{ referenceName: 'my-field', value: 'some value' }]],
                    (err, result) => {
                        expect(result).to.not.be.ok;
                        expect(err).to.be.ok.and.to.be.instanceOf(FieldInputError);
                        expect(err.message).to.include(`No corresponding input field found with name 'my-field'`);
                        expect(client._internalClient.startInstance).to.have.callCount(0);
                    }
                );
            });
        });

        it('should throw proper error when Instance start request fails', function() {
            const workflow = mock.mockWorkflow();
            const workflowID = workflow.id;
            sinon
                .stub(client._internalClient, 'getWorkflow')
                .callsFake(() => Promise.resolve(createResponse(workflow)));
            sinon
                .stub(client._internalClient, 'startInstance')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));
            const name = 'test instance name';

            return executeTest(client.instances, 'start', [workflowID, name], (err, result) => {
                expect(result).to.not.be.ok;
                expect(err).to.be.ok;
                expect(err.message).to.include('Intentional bad request error');
                expect(client._internalClient.startInstance).to.have.callCount(1);
                expect(client._internalClient.startInstance).to.have.been.calledWith({
                    body: {
                        workflowId: workflowID,
                        inputFields: null,
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
                    .stub(client._internalClient, 'getInstanceStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));

                return executeTest(client.instances, 'getInstanceStep', [mockInstanceStep.id], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStep)));
                    expect(client._internalClient.getInstanceStep).to.have.callCount(1);
                    expect(client._internalClient.getInstanceStep).to.have.been.calledWith(
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
                    .stub(client._internalClient, 'getInstanceStep')
                    .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

                return executeTest(client.instances, 'getInstanceStep', [id], (error, result) => {
                    expect(result).to.not.be.ok;
                    expect(error).to.be.ok;
                    expect(error.message).to.include('Intentional not found error');
                    expect(client._internalClient.getInstanceStep).to.have.callCount(1);
                    expect(client._internalClient.getInstanceStep).to.have.been.calledWith(id, WildcardId, {
                        customHeaders: expectedCustomHeaders
                    });
                });
            });
        });

        describe('Find InstanceSteps', function() {
            it('should find InstanceSteps with no filter options', function() {
                const mockInstanceStepsPage = mock.mockInstanceStepsPage();
                sinon
                    .stub(client._internalClient, 'findInstanceSteps')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStepsPage)));

                return executeTest(client.instances, 'findInstanceSteps', [], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStepsPage)));
                    expect(client._internalClient.findInstanceSteps).to.have.callCount(1);
                    expect(client._internalClient.findInstanceSteps).to.have.been.calledWith(WildcardId, {
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
                    .stub(client._internalClient, 'findInstanceSteps')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStepsPage)));

                return executeTest(client.instances, 'findInstanceSteps', [options], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStepsPage)));
                    expect(client._internalClient.findInstanceSteps).to.have.callCount(1);
                    expect(client._internalClient.findInstanceSteps).to.have.been.calledWith(options.instanceID, {
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
                    .stub(client._internalClient, 'findInstanceSteps')
                    .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

                return executeTest(client.instances, 'findInstanceSteps', [], (error, result) => {
                    expect(result).to.not.be.ok;
                    expect(error).to.be.ok;
                    expect(error.message).to.include('Intentional bad request error');
                    expect(client._internalClient.findInstanceSteps).to.have.callCount(1);
                    expect(client._internalClient.findInstanceSteps).to.have.been.calledWith(WildcardId, {
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

        describe('Get InstanceSteps for Instance', function() {
            it('should get all InstanceSteps for Instance', function() {
                const instanceId = v4();
                const mockInstanceStepsPage1 = mock.mockInstanceStepsPage();
                const pageToken = 'test-page-token';
                mockInstanceStepsPage1.nextPageToken = pageToken;
                const mockInstanceStepsPage2 = mock.mockInstanceStepsPage();
                sinon
                    .stub(client._internalClient, 'findInstanceSteps')
                    .onFirstCall()
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStepsPage1)))
                    .onSecondCall()
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStepsPage2)));

                return executeTest(client.instances, 'getInstanceSteps', [instanceId], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(
                        JSON.parse(JSON.stringify(mockInstanceStepsPage1.steps.concat(mockInstanceStepsPage2.steps)))
                    );
                    expect(client._internalClient.findInstanceSteps).to.have.callCount(2);
                    expect(client._internalClient.findInstanceSteps).to.have.been.calledWith(instanceId, {
                        customHeaders: expectedCustomHeaders,
                        pageSize: undefined,
                        pageToken: undefined,
                        participatingUsers: undefined,
                        processId: undefined,
                        query: undefined,
                        runId: instanceId
                    });
                    expect(client._internalClient.findInstanceSteps).to.have.been.calledWith(instanceId, {
                        customHeaders: expectedCustomHeaders,
                        pageSize: undefined,
                        pageToken,
                        participatingUsers: undefined,
                        processId: undefined,
                        query: undefined,
                        runId: instanceId
                    });
                });
            });

            it('should throw error when bad response code returned', function() {
                const instanceId = v4();
                const mockInstanceStepsPage1 = mock.mockInstanceStepsPage();
                const pageToken = 'test-page-token';
                mockInstanceStepsPage1.nextPageToken = pageToken;
                sinon
                    .stub(client._internalClient, 'findInstanceSteps')
                    .onFirstCall()
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStepsPage1)))
                    .onSecondCall()
                    .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

                return executeTest(client.instances, 'getInstanceSteps', [instanceId], (error, result) => {
                    expect(result).to.not.be.ok;
                    expect(error).to.be.ok;
                    expect(error.message).to.include('Intentional bad request error');
                    expect(client._internalClient.findInstanceSteps).to.have.callCount(2);
                    expect(client._internalClient.findInstanceSteps).to.have.been.calledWith(instanceId, {
                        customHeaders: expectedCustomHeaders,
                        pageSize: undefined,
                        pageToken: undefined,
                        participatingUsers: undefined,
                        processId: undefined,
                        query: undefined,
                        runId: instanceId
                    });
                    expect(client._internalClient.findInstanceSteps).to.have.been.calledWith(instanceId, {
                        customHeaders: expectedCustomHeaders,
                        pageSize: undefined,
                        pageToken,
                        participatingUsers: undefined,
                        processId: undefined,
                        query: undefined,
                        runId: instanceId
                    });
                });
            });
        });

        describe('Reassign InstanceStep', function() {
            it('should reassign an InstanceStep to a new user', function() {
                const mockInstanceStep = mock.mockInstanceStep();
                const email = 'test@example.com';
                sinon
                    .stub(client._internalClient, 'reassignStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));

                return executeTest(
                    client.instances,
                    'reassignInstanceStep',
                    [mockInstanceStep.id, email],
                    (err, result) => {
                        expect(err).to.not.be.ok;

                        expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStep)));
                        expect(client._internalClient.reassignStep).to.have.callCount(1);
                        expect(client._internalClient.reassignStep).to.have.been.calledWith(
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
                    .stub(client._internalClient, 'reassignStep')
                    .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

                return executeTest(
                    client.instances,
                    'reassignInstanceStep',
                    [mockInstanceStep.id, email],
                    (err, result) => {
                        expect(result).to.not.be.ok;
                        expect(err).to.be.ok;
                        expect(err.message).to.include('Intentional bad request error');
                        expect(client._internalClient.reassignStep).to.have.callCount(1);
                        expect(client._internalClient.reassignStep).to.have.been.calledWith(
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
                    .stub(client._internalClient, 'getInstanceStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));
                sinon
                    .stub(client._internalClient, 'completeStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));

                return executeTest(client.instances, 'completeInstanceStep', [mockInstanceStep.id], (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStep)));
                    expect(client._internalClient.completeStep).to.have.callCount(1);
                    expect(client._internalClient.completeStep).to.have.been.calledWith(
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
                });
            });

            it('should complete an InstanceStep with output fields', function() {
                const mockInstanceStep = mock.mockInstanceStep();
                mockInstanceStep.outputFields = [
                    { name: 'My Field', fieldType: 'text' },
                    { name: 'Another Field', fieldType: 'user' }
                ];
                sinon
                    .stub(client._internalClient, 'getInstanceStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));
                const fields = [
                    { name: 'My Field', value: 'some value' },
                    { name: 'Another Field', value: v4() }
                ];
                sinon
                    .stub(client._internalClient, 'completeStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));

                return executeTest(
                    client.instances,
                    'completeInstanceStep',
                    [mockInstanceStep.id, fields],
                    (err, result) => {
                        expect(err).to.not.be.ok;

                        expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStep)));
                        expect(client._internalClient.completeStep).to.have.callCount(1);
                        expect(client._internalClient.completeStep).to.have.been.calledWith(
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

            it('should automatically upload file field if path is passed as value', function() {
                const filePath = join(__dirname, '../fixtures/test.txt');
                const mockFileMetadata = mock.mockFileMetadata();
                // stubbing protected method on BaseClient, which is called by FileClient.upload
                const stub = sinon.stub(client.instances, 'uploadFile' as any).callsFake(() => {
                    const result = new FileMetadataPage();
                    result.files = [mockFileMetadata];
                    return Promise.resolve(result);
                });

                const mockInstanceStep = mock.mockInstanceStep();
                mockInstanceStep.outputFields = [{ name: 'My Field', fieldType: 'file' }];
                sinon
                    .stub(client._internalClient, 'getInstanceStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));
                sinon
                    .stub(client._internalClient, 'completeStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));
                const fields = [{ referenceName: 'My Field', value: filePath }];

                return executeTest(
                    client.instances,
                    'completeInstanceStep',
                    [mockInstanceStep.id, fields],
                    (err, result) => {
                        expect(err).to.not.be.ok;

                        expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStep)));
                        expect(client._internalClient.getInstanceStep).to.have.callCount(1);
                        expect(client._internalClient.getInstanceStep).to.have.been.calledWith(
                            mockInstanceStep.id,
                            WildcardId,
                            {
                                customHeaders: expectedCustomHeaders
                            }
                        );
                        expect(stub).to.have.callCount(1);
                        expect(stub).to.have.been.calledWith(filePath);
                        expect(client._internalClient.completeStep).to.have.callCount(1);
                        expect(client._internalClient.completeStep).to.have.been.calledWith(
                            mockInstanceStep.id,
                            WildcardId,
                            {
                                body: {
                                    id: mockInstanceStep.id,
                                    stepOutputFields: [
                                        {
                                            name: undefined,
                                            referenceName: 'my-field',
                                            value: mockFileMetadata.id
                                        }
                                    ]
                                },
                                customHeaders: expectedCustomHeaders
                            }
                        );
                    }
                );
            });

            it('should passthrough file id if file field value is a UUID', function() {
                const mockFileMetadata = mock.mockFileMetadata();
                // stubbing protected method on BaseClient, which is called by FileClient.upload
                const stub = sinon.stub(client.instances, 'uploadFile' as any);

                const mockInstanceStep = mock.mockInstanceStep();
                mockInstanceStep.outputFields = [{ name: 'My Field', fieldType: 'file' }];
                sinon
                    .stub(client._internalClient, 'getInstanceStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));
                sinon
                    .stub(client._internalClient, 'completeStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));
                const fields = [{ referenceName: 'My Field', value: mockFileMetadata.id }];

                return executeTest(
                    client.instances,
                    'completeInstanceStep',
                    [mockInstanceStep.id, fields],
                    (err, result) => {
                        expect(err).to.not.be.ok;

                        expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockInstanceStep)));
                        expect(client._internalClient.getInstanceStep).to.have.callCount(1);
                        expect(client._internalClient.getInstanceStep).to.have.been.calledWith(
                            mockInstanceStep.id,
                            WildcardId,
                            {
                                customHeaders: expectedCustomHeaders
                            }
                        );
                        expect(stub).to.have.callCount(0);
                        expect(client._internalClient.completeStep).to.have.callCount(1);
                        expect(client._internalClient.completeStep).to.have.been.calledWith(
                            mockInstanceStep.id,
                            WildcardId,
                            {
                                body: {
                                    id: mockInstanceStep.id,
                                    stepOutputFields: [
                                        {
                                            name: undefined,
                                            referenceName: 'my-field',
                                            value: mockFileMetadata.id
                                        }
                                    ]
                                },
                                customHeaders: expectedCustomHeaders
                            }
                        );
                    }
                );
            });

            it('should throw error if field does not exist on InstanceStep', function() {
                const mockInstanceStep = mock.mockInstanceStep();
                mockInstanceStep.outputFields = [];
                const fields = [{ name: 'My Field', value: 'some value' }];
                sinon
                    .stub(client._internalClient, 'getInstanceStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));
                sinon.stub(client._internalClient, 'completeStep');

                return executeTest(
                    client.instances,
                    'completeInstanceStep',
                    [mockInstanceStep.id, fields],
                    (err, result) => {
                        expect(result).to.not.be.ok;
                        expect(err).to.be.ok.and.to.be.instanceOf(FieldInputError);
                        expect(err.message).to.include(`No corresponding input field found with name 'My Field'`);
                        expect(client._internalClient.completeStep).to.have.callCount(0);
                    }
                );
            });

            it('should throw error when bad status code returned', function() {
                const mockInstanceStep = mock.mockInstanceStep();
                sinon
                    .stub(client._internalClient, 'getInstanceStep')
                    .callsFake(() => Promise.resolve(createResponse(mockInstanceStep)));
                sinon
                    .stub(client._internalClient, 'completeStep')
                    .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

                return executeTest(
                    client.instances,
                    'completeInstanceStep',
                    [mockInstanceStep.id, []],
                    (err, result) => {
                        expect(result).to.not.be.ok;
                        expect(err).to.be.ok;
                        expect(err.message).to.include('Intentional bad request error');
                        expect(client._internalClient.completeStep).to.have.callCount(1);
                        expect(client._internalClient.completeStep).to.have.been.calledWith(
                            mockInstanceStep.id,
                            WildcardId,
                            {
                                customHeaders: expectedCustomHeaders,
                                body: {
                                    id: mockInstanceStep.id,
                                    stepOutputFields: []
                                }
                            }
                        );
                    }
                );
            });
            it('should throw an error when user/table/instance/workflow field is not a UUID', async function() {
                const stub = sinon.stub(client._internalClient, 'getInstanceStep');
                sinon.stub(client._internalClient, 'completeStep');
                await Bluebird.each(['user', 'workflow', 'table', 'instance'], async fieldType => {
                    const instanceStep = mock.mockInstanceStep();
                    instanceStep.outputFields = [{ name: 'My Field', fieldType: fieldType as FieldType }];
                    const instanceStepID = instanceStep.id;
                    stub.callsFake(() => Promise.resolve(createResponse(instanceStep)));

                    await executeTest(
                        client.instances,
                        'completeInstanceStep',
                        [instanceStepID, [{ name: 'My Field', value: 'not-a-uuid' }]],
                        (err, result) => {
                            expect(result).to.not.be.ok;
                            expect(err).to.be.ok.and.to.be.instanceOf(FieldInputError);
                            expect(err.message).to.include(
                                `Value 'not-a-uuid' provided for field 'My Field' of type '${fieldType}' is not a valid ID`
                            );
                            expect(client._internalClient.completeStep).to.have.callCount(0);
                        }
                    );
                });
            });
        });
    });
});
