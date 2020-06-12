import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';
import { createResponse, executeTest } from '../helpers';
import { join } from 'path';
import { WorkflowImportError, WorkflowExportError } from '../../src/errors';
import { FileMetadataPage } from '../../src/entities';

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

    describe('Import Workflow', function() {
        it('should import a Workflow with password', function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const password = 'p@$$w0rd';

            const mockFileMetadata = mock.mockFileMetadata();
            const mockWorkflow = mock.mockWorkflow();
            const mockWorkflowImport = mock.mockWorkflowImport();
            mockWorkflowImport.workflowId = mockWorkflow.id;
            // stubbing protected method on BaseClient, which is called by WorkflowClient.import
            const uploadFileStub = sinon.stub(client.workflowClient, 'uploadFile' as any).callsFake(() => {
                const result = new FileMetadataPage();
                result.files = [mockFileMetadata];
                return Promise.resolve(result);
            });
            sinon
                .stub(client.internalClient, 'importWorkflow')
                .callsFake(() => Promise.resolve(createResponse({ ...mockWorkflowImport, workflowId: null })));

            sinon
                .stub(client.internalClient, 'getWorkflowImport')
                .callsFake(() => Promise.resolve(createResponse(mockWorkflowImport)));

            sinon
                .stub(client.internalClient, 'getWorkflow')
                .callsFake(() => Promise.resolve(createResponse(mockWorkflow)));

            return executeTest(client.workflowClient, 'import', [filePath, password], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockWorkflow)));

                expect(uploadFileStub).to.have.callCount(1);
                expect(uploadFileStub).to.have.been.calledWith(filePath);

                expect(client.internalClient.importWorkflow).to.have.callCount(1);
                expect(client.internalClient.importWorkflow).to.have.been.calledWith({
                    body: {
                        fileId: mockFileMetadata.id,
                        password
                    },
                    customHeaders: expectedCustomHeaders
                });

                expect(client.internalClient.getWorkflowImport).to.have.callCount(1);
                expect(client.internalClient.getWorkflowImport).to.have.been.calledWith(mockWorkflowImport.id, {
                    customHeaders: expectedCustomHeaders
                });

                expect(client.internalClient.getWorkflow).to.have.callCount(1);
                expect(client.internalClient.getWorkflow).to.have.been.calledWith(mockWorkflowImport.workflowId, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should import a Workflow without password', function() {
            const filePath = join(__dirname, '../fixtures/test.txt');

            const mockFileMetadata = mock.mockFileMetadata();
            const mockWorkflow = mock.mockWorkflow();
            const mockWorkflowImport = mock.mockWorkflowImport();
            mockWorkflowImport.workflowId = mockWorkflow.id;
            // stubbing protected method on BaseClient, which is called by WorkflowClient.import
            const uploadFileStub = sinon.stub(client.workflowClient, 'uploadFile' as any).callsFake(() => {
                const result = new FileMetadataPage();
                result.files = [mockFileMetadata];
                return Promise.resolve(result);
            });
            sinon
                .stub(client.internalClient, 'importWorkflow')
                .callsFake(() => Promise.resolve(createResponse({ ...mockWorkflowImport, workflowId: null })));

            sinon
                .stub(client.internalClient, 'getWorkflowImport')
                .callsFake(() => Promise.resolve(createResponse(mockWorkflowImport)));

            sinon
                .stub(client.internalClient, 'getWorkflow')
                .callsFake(() => Promise.resolve(createResponse(mockWorkflow)));

            return executeTest(client.workflowClient, 'import', [filePath], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockWorkflow)));

                expect(uploadFileStub).to.have.callCount(1);
                expect(uploadFileStub).to.have.been.calledWith(filePath);

                expect(client.internalClient.importWorkflow).to.have.callCount(1);
                expect(client.internalClient.importWorkflow).to.have.been.calledWith({
                    body: {
                        fileId: mockFileMetadata.id,
                        password: null
                    },
                    customHeaders: expectedCustomHeaders
                });

                expect(client.internalClient.getWorkflowImport).to.have.callCount(1);
                expect(client.internalClient.getWorkflowImport).to.have.been.calledWith(mockWorkflowImport.id, {
                    customHeaders: expectedCustomHeaders
                });

                expect(client.internalClient.getWorkflow).to.have.callCount(1);
                expect(client.internalClient.getWorkflow).to.have.been.calledWith(mockWorkflowImport.workflowId, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should handle import Workflow error', function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const password = 'p@$$w0rd';

            const mockFileMetadata = mock.mockFileMetadata();
            const mockWorkflow = mock.mockWorkflow();
            const mockWorkflowImport = mock.mockWorkflowImport();
            mockWorkflowImport.workflowId = mockWorkflow.id;
            // stubbing protected method on BaseClient, which is called by FileClient.upload
            // stubbing protected method on BaseClient, which is called by WorkflowClient.import
            const uploadFileStub = sinon.stub(client.workflowClient, 'uploadFile' as any).callsFake(() => {
                const result = new FileMetadataPage();
                result.files = [mockFileMetadata];
                return Promise.resolve(result);
            });
            sinon
                .stub(client.internalClient, 'importWorkflow')
                .callsFake(() => Promise.resolve(createResponse({ ...mockWorkflowImport, workflowId: null })));

            sinon
                .stub(client.internalClient, 'getWorkflowImport')
                .callsFake(() =>
                    Promise.resolve(
                        createResponse({ ...mockWorkflowImport, errorMessage: 'Intentional Workflow import failure' })
                    )
                );

            return executeTest(client.workflowClient, 'import', [filePath, password], (err, result) => {
                expect(result).to.not.be.ok;
                expect(err).to.be.ok;
                expect(err).to.be.instanceOf(WorkflowImportError);
                expect(err.message).to.include('Intentional Workflow import failure');

                expect(uploadFileStub).to.have.callCount(1);
                expect(uploadFileStub).to.have.been.calledWith(filePath);

                expect(client.internalClient.importWorkflow).to.have.callCount(1);
                expect(client.internalClient.importWorkflow).to.have.been.calledWith({
                    body: {
                        fileId: mockFileMetadata.id,
                        password
                    },
                    customHeaders: expectedCustomHeaders
                });

                expect(client.internalClient.getWorkflowImport).to.have.callCount(1);
                expect(client.internalClient.getWorkflowImport).to.have.been.calledWith(mockWorkflowImport.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Export Workflow', function() {
        it('should export a Workflow with password', function() {
            const workflowId = v4();
            const password = 'p@$$w0rd';
            const mockFileMetadata = mock.mockFileMetadata();
            const mockWorkflowExport = { fileId: mockFileMetadata.id, id: v4() };

            sinon
                .stub(client.internalClient, 'exportWorkflow')
                .callsFake(() => Promise.resolve(createResponse({ ...mockWorkflowExport, fileId: null })));

            sinon
                .stub(client.internalClient, 'getWorkflowExport')
                .callsFake(() => Promise.resolve(createResponse(mockWorkflowExport)));

            sinon
                .stub(client.internalClient, 'getFile')
                .callsFake(() => Promise.resolve(createResponse(mockFileMetadata)));

            return executeTest(client.workflowClient, 'export', [workflowId, password], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockFileMetadata)));

                expect(client.internalClient.exportWorkflow).to.have.callCount(1);
                expect(client.internalClient.exportWorkflow).to.have.been.calledWith(workflowId, {
                    body: {
                        workflowId,
                        password
                    },
                    customHeaders: expectedCustomHeaders
                });

                expect(client.internalClient.getWorkflowExport).to.have.callCount(1);
                expect(client.internalClient.getWorkflowExport).to.have.been.calledWith(mockWorkflowExport.id, {
                    customHeaders: expectedCustomHeaders
                });

                expect(client.internalClient.getFile).to.have.callCount(1);
                expect(client.internalClient.getFile).to.have.been.calledWith(mockWorkflowExport.fileId, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should export a Workflow without password', function() {
            const workflowId = v4();
            const mockFileMetadata = mock.mockFileMetadata();
            const mockWorkflowExport = { fileId: mockFileMetadata.id, id: v4() };

            sinon
                .stub(client.internalClient, 'exportWorkflow')
                .callsFake(() => Promise.resolve(createResponse({ ...mockWorkflowExport, fileId: null })));

            sinon
                .stub(client.internalClient, 'getWorkflowExport')
                .callsFake(() => Promise.resolve(createResponse(mockWorkflowExport)));

            sinon
                .stub(client.internalClient, 'getFile')
                .callsFake(() => Promise.resolve(createResponse(mockFileMetadata)));

            return executeTest(client.workflowClient, 'export', [workflowId], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockFileMetadata)));

                expect(client.internalClient.exportWorkflow).to.have.callCount(1);
                expect(client.internalClient.exportWorkflow).to.have.been.calledWith(workflowId, {
                    body: {
                        workflowId,
                        password: null
                    },
                    customHeaders: expectedCustomHeaders
                });

                expect(client.internalClient.getWorkflowExport).to.have.callCount(1);
                expect(client.internalClient.getWorkflowExport).to.have.been.calledWith(mockWorkflowExport.id, {
                    customHeaders: expectedCustomHeaders
                });

                expect(client.internalClient.getFile).to.have.callCount(1);
                expect(client.internalClient.getFile).to.have.been.calledWith(mockWorkflowExport.fileId, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should handle export Workflow error', function() {
            const workflowId = v4();
            const password = 'p@$$w0rd';
            const mockFileMetadata = mock.mockFileMetadata();
            const mockWorkflowExport = { fileId: mockFileMetadata.id, id: v4() };

            sinon
                .stub(client.internalClient, 'exportWorkflow')
                .callsFake(() => Promise.resolve(createResponse({ ...mockWorkflowExport, fileId: null })));

            sinon
                .stub(client.internalClient, 'getWorkflowExport')
                .callsFake(() =>
                    Promise.resolve(
                        createResponse({ ...mockWorkflowExport, errorMessage: 'Intentional Workflow export failure' })
                    )
                );

            return executeTest(client.workflowClient, 'export', [workflowId, password], (err, result) => {
                expect(result).to.not.be.ok;
                expect(err).to.be.ok;
                expect(err).to.be.instanceOf(WorkflowExportError);
                expect(err.message).to.include('Intentional Workflow export failure');

                expect(client.internalClient.exportWorkflow).to.have.callCount(1);
                expect(client.internalClient.exportWorkflow).to.have.been.calledWith(workflowId, {
                    body: {
                        workflowId,
                        password
                    },
                    customHeaders: expectedCustomHeaders
                });

                expect(client.internalClient.getWorkflowExport).to.have.callCount(1);
                expect(client.internalClient.getWorkflowExport).to.have.been.calledWith(mockWorkflowExport.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });
});
