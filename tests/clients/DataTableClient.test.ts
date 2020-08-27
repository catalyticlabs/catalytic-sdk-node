import chai from 'chai';
import { createReadStream } from 'fs';
import { join } from 'path';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';
import { createResponse, executeTest } from '../helpers';
import { InternalError, ResourceNotFoundError } from '../../src/errors';
import { DataTableExportFormat } from '../../src/clients/DataTableClient';

describe('DataTableClient', function() {
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

    describe('Get DataTable', function() {
        it('should get a DataTable by ID', async function() {
            const mockDataTable = mock.mockDataTable();
            sinon
                .stub(client._internalClient, 'getDataTable')
                .callsFake(() => Promise.resolve(createResponse(mockDataTable)));

            return executeTest(client.dataTables, 'get', [mockDataTable.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTable)));
                expect(client._internalClient.getDataTable).to.have.callCount(1);
                expect(client._internalClient.getDataTable).to.have.been.calledWith(mockDataTable.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when DataTable not found', async function() {
            const id = v4();
            sinon
                .stub(client._internalClient, 'getDataTable')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.dataTables, 'get', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok.and.to.be.instanceOf(ResourceNotFoundError);
                expect(error.message).to.include('Intentional not found error');
                expect(client._internalClient.getDataTable).to.have.callCount(1);
                expect(client._internalClient.getDataTable).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });
    describe('Find DataTables', function() {
        it('should find DataTables with no filter options', async function() {
            const mockDataTablesPage = mock.mockDataTablesPage();
            sinon
                .stub(client._internalClient, 'findDataTables')
                .callsFake(() => Promise.resolve(createResponse(mockDataTablesPage)));

            return executeTest(client.dataTables, 'find', [], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTablesPage)));
                expect(client._internalClient.findDataTables).to.have.callCount(1);
                expect(client._internalClient.findDataTables).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should find DataTables with filter options', async function() {
            const options = { pageSize: 3, query: 'some table' };
            const mockDataTablesPage = mock.mockDataTablesPage();
            sinon
                .stub(client._internalClient, 'findDataTables')
                .callsFake(() => Promise.resolve(createResponse(mockDataTablesPage)));

            return executeTest(client.dataTables, 'find', [options], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTablesPage)));
                expect(client._internalClient.findDataTables).to.have.callCount(1);
                expect(client._internalClient.findDataTables).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders,
                    ...options
                });
            });
        });

        it('should return exception when bad response code returned', async function() {
            sinon
                .stub(client._internalClient, 'findDataTables')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

            return executeTest(client.dataTables, 'find', [], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional bad request error');
                expect(client._internalClient.findDataTables).to.have.callCount(1);
                expect(client._internalClient.findDataTables).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Get a Download Blob', function() {
        it('should get a download blob by ID', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const id = v4();
            const format = DataTableExportFormat.CSV;
            const stream = createReadStream(filePath);
            // stubbing protected method on BaseClient, which is called by dataTables.getDownloadBlob
            const stub = sinon
                .stub(client.dataTables, 'getFileDownloadBlob' as any)
                .callsFake(() => Promise.resolve(stream));

            return executeTest(client.dataTables, 'getDownloadBlob', [id, format], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(stream);
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(`/tables/${id}/download?format=${format}`);
            });
        });

        it('should return expected error response when error fetching download blob', function() {
            const id = v4();
            const format = DataTableExportFormat.CSV;
            // stubbing protected method on BaseClient, which is called by dataTables.getDownloadBlob
            const stub = sinon.stub(client.dataTables, 'getFileDownloadBlob' as any).callsFake(() => {
                throw new InternalError('Intentional server error');
            });

            return executeTest(client.dataTables, 'getDownloadBlob', [id, format], (err, result) => {
                expect(result).to.not.be.ok;
                expect(err).to.be.ok;
                expect(err).to.be.instanceOf(InternalError);
                expect(err.message).to.include('Intentional server error');
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(`/tables/${id}/download?format=${format}`);
            });
        });
    });

    describe('Get a Download Stream', function() {
        it('should get a download stream by ID', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const id = v4();
            const format = DataTableExportFormat.CSV;
            const stream = createReadStream(filePath);
            // stubbing protected method on BaseClient, which is called by dataTables.getDownloadStream
            const stub = sinon
                .stub(client.dataTables, 'getFileDownloadStream' as any)
                .callsFake(() => Promise.resolve(stream));

            return executeTest(client.dataTables, 'getDownloadStream', [id, format], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(stream);
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(`/tables/${id}/download?format=${format}`);
            });
        });

        it('should return expected error response when error fetching download stream', function() {
            const id = v4();
            const format = DataTableExportFormat.CSV;
            // stubbing protected method on BaseClient, which is called by dataTables.getDownloadStream
            const stub = sinon.stub(client.dataTables, 'getFileDownloadStream' as any).callsFake(() => {
                throw new InternalError('Intentional server error');
            });

            return executeTest(client.dataTables, 'getDownloadStream', [id, format], (err, result) => {
                expect(result).to.not.be.ok;
                expect(err).to.be.ok;
                expect(err).to.be.instanceOf(InternalError);
                expect(err.message).to.include('Intentional server error');
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(`/tables/${id}/download?format=${format}`);
            });
        });
    });

    describe('Download Data Table', function() {
        it('should download a Data Table by ID', async function() {
            const outputPath = '/fake/path/to/file';
            const id = v4();
            const format = DataTableExportFormat.CSV;
            // stubbing protected method on BaseClient, which is called by dataTables.download
            const stub = sinon.stub(client.dataTables, 'downloadFile' as any).callsFake(() => Promise.resolve());

            return executeTest(client.dataTables, 'download', [id, format, outputPath], (err, result) => {
                expect(err).to.not.be.ok;
                // no result returned from method
                expect(result).to.not.be.ok;
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(`/tables/${id}/download?format=${format}`, outputPath);
            });
        });

        it('should return expected error response when file fails to upload', function() {
            const id = v4();
            const format = DataTableExportFormat.CSV;
            const outputPath = '/fake/path/to/file';
            // stubbing protected method on BaseClient, which is called by dataTables.download
            const stub = sinon.stub(client.dataTables, 'downloadFile' as any).callsFake(() => {
                throw new InternalError('Intentional server error');
            });

            return executeTest(client.dataTables, 'download', [id, format, outputPath], (err, result) => {
                expect(result).to.not.be.ok;
                expect(err).to.be.ok;
                expect(err).to.be.instanceOf(InternalError);
                expect(err.message).to.include('Intentional server error');
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(`/tables/${id}/download?format=${format}`, outputPath);
            });
        });
    });

    describe('Upload Data Table', function() {
        it('should upload a Data Table from a local path with all args', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const tableName = 'My table';
            const headerRow = 2;
            const sheetNumber = 3;
            const mockDataTable = mock.mockDataTable();
            // stubbing protected method on BaseClient, which is called by dataTables.upload
            const stub = sinon
                .stub(client.dataTables, 'uploadFile' as any)
                .callsFake(() => Promise.resolve(mockDataTable));

            return executeTest(
                client.dataTables,
                'upload',
                [filePath, tableName, headerRow, sheetNumber],
                (err, result) => {
                    expect(err).to.not.be.ok;

                    expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTable)));
                    expect(stub).to.have.callCount(1);
                    expect(stub).to.have.been.calledWith(
                        filePath,
                        `/tables:upload?headerRow=${headerRow}&sheetNumber=${sheetNumber}&tableName=${encodeURIComponent(
                            tableName
                        )}`
                    );
                }
            );
        });

        it('should upload a Data Table from a local path with no sheetNumber specified', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const tableName = 'My table';
            const headerRow = 2;
            const mockDataTable = mock.mockDataTable();
            // stubbing protected method on BaseClient, which is called by dataTables.upload
            const stub = sinon
                .stub(client.dataTables, 'uploadFile' as any)
                .callsFake(() => Promise.resolve(mockDataTable));

            return executeTest(client.dataTables, 'upload', [filePath, tableName, headerRow], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTable)));
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(
                    filePath,
                    `/tables:upload?headerRow=${headerRow}&sheetNumber=1&tableName=${encodeURIComponent(tableName)}`
                );
            });
        });

        it('should upload a Data Table from a local path with no sheetNumber or headerRow specified', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const tableName = 'My table';
            const mockDataTable = mock.mockDataTable();
            // stubbing protected method on BaseClient, which is called by dataTables.upload
            const stub = sinon
                .stub(client.dataTables, 'uploadFile' as any)
                .callsFake(() => Promise.resolve(mockDataTable));

            return executeTest(client.dataTables, 'upload', [filePath, tableName], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTable)));
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(
                    filePath,
                    `/tables:upload?headerRow=1&sheetNumber=1&tableName=${encodeURIComponent(tableName)}`
                );
            });
        });

        it('should upload a Data Table from a local path with no optional args', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const mockDataTable = mock.mockDataTable();
            // stubbing protected method on BaseClient, which is called by dataTables.upload
            const stub = sinon
                .stub(client.dataTables, 'uploadFile' as any)
                .callsFake(() => Promise.resolve(mockDataTable));

            return executeTest(client.dataTables, 'upload', [filePath], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTable)));
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(filePath, '/tables:upload?headerRow=1&sheetNumber=1');
            });
        });

        it('should return expected error response when file fails to upload', function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            // stubbing protected method on BaseClient, which is called by dataTables.upload
            const stub = sinon.stub(client.dataTables, 'uploadFile' as any).callsFake(() => {
                throw new InternalError('Intentional server error');
            });

            return executeTest(client.dataTables, 'upload', [filePath], (err, result) => {
                expect(result).to.not.be.ok;
                expect(err).to.be.ok;
                expect(err).to.be.instanceOf(InternalError);
                expect(err.message).to.include('Intentional server error');
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(filePath, '/tables:upload?headerRow=1&sheetNumber=1');
            });
        });
    });

    describe('Replace Data Table', function() {
        it('should replace a Data Table from a local file with all args', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const id = v4();
            const headerRow = 2;
            const sheetNumber = 3;
            const mockDataTable = mock.mockDataTable();
            // stubbing protected method on BaseClient, which is called by dataTables.upload
            const stub = sinon
                .stub(client.dataTables, 'uploadFile' as any)
                .callsFake(() => Promise.resolve(mockDataTable));

            return executeTest(client.dataTables, 'replace', [id, filePath, headerRow, sheetNumber], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTable)));
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(
                    filePath,
                    `/tables/${id}:replace?headerRow=${headerRow}&sheetNumber=${sheetNumber}`
                );
            });
        });

        it('should upload a Data Table from a local file with no sheetNumber specified', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const id = v4();
            const headerRow = 5;
            const mockDataTable = mock.mockDataTable();
            // stubbing protected method on BaseClient, which is called by dataTables.upload
            const stub = sinon
                .stub(client.dataTables, 'uploadFile' as any)
                .callsFake(() => Promise.resolve(mockDataTable));

            return executeTest(client.dataTables, 'replace', [id, filePath, headerRow], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTable)));
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(
                    filePath,
                    `/tables/${id}:replace?headerRow=${headerRow}&sheetNumber=1`
                );
            });
        });

        it('should upload a Data Table from a local file with no sheetNumber or headerRow specified', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const id = v4();
            const mockDataTable = mock.mockDataTable();
            // stubbing protected method on BaseClient, which is called by dataTables.upload
            const stub = sinon
                .stub(client.dataTables, 'uploadFile' as any)
                .callsFake(() => Promise.resolve(mockDataTable));

            return executeTest(client.dataTables, 'replace', [id, filePath], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTable)));
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(filePath, `/tables/${id}:replace?headerRow=1&sheetNumber=1`);
            });
        });

        it('should return expected error response when file fails to upload', function() {
            const id = v4();
            const filePath = join(__dirname, '../fixtures/test.txt');
            // stubbing protected method on BaseClient, which is called by dataTables.upload
            const stub = sinon.stub(client.dataTables, 'uploadFile' as any).callsFake(() => {
                throw new InternalError('Intentional server error');
            });

            return executeTest(client.dataTables, 'replace', [id, filePath], (err, result) => {
                expect(result).to.not.be.ok;
                expect(err).to.be.ok;
                expect(err).to.be.instanceOf(InternalError);
                expect(err.message).to.include('Intentional server error');
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(filePath, `/tables/${id}:replace?headerRow=1&sheetNumber=1`);
            });
        });
    });
});
