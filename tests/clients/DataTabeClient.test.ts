import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';
import { createResponse, executeTest } from '../helpers';

describe('DataTableClient', function() {
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

    describe('Get DataTable', function() {
        it('should get a DataTable by ID', async function() {
            const mockDataTable = mock.mockDataTable();
            sinon
                .stub(client.internalClient, 'getDataTable')
                .callsFake(() => Promise.resolve(createResponse(mockDataTable)));

            return executeTest(client.dataTableClient, 'get', [mockDataTable.id], (err, result) => {
                console.error(err);
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTable)));
                expect(client.internalClient.getDataTable).to.have.callCount(1);
                expect(client.internalClient.getDataTable).to.have.been.calledWith(mockDataTable.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when DataTable not found', async function() {
            const id = v4();
            sinon
                .stub(client.internalClient, 'getDataTable')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.dataTableClient, 'get', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client.internalClient.getDataTable).to.have.callCount(1);
                expect(client.internalClient.getDataTable).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });
    describe('Find DataTables', function() {
        it('should find DataTables with no filter options', async function() {
            const mockDataTablesPage = mock.mockDataTablesPage();
            sinon
                .stub(client.internalClient, 'findDataTables')
                .callsFake(() => Promise.resolve(createResponse(mockDataTablesPage)));

            return executeTest(client.dataTableClient, 'find', [], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTablesPage)));
                expect(client.internalClient.findDataTables).to.have.callCount(1);
                expect(client.internalClient.findDataTables).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should find DataTables with filter options', async function() {
            const options = { pageSize: 3, query: 'some table' };
            const mockDataTablesPage = mock.mockDataTablesPage();
            sinon
                .stub(client.internalClient, 'findDataTables')
                .callsFake(() => Promise.resolve(createResponse(mockDataTablesPage)));

            return executeTest(client.dataTableClient, 'find', [options], (err, result) => {
                console.error(err);
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTablesPage)));
                expect(client.internalClient.findDataTables).to.have.callCount(1);
                expect(client.internalClient.findDataTables).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders,
                    ...options
                });
            });
        });

        it('should return exception when bad response code returned', async function() {
            sinon
                .stub(client.internalClient, 'findDataTables')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

            return executeTest(client.dataTableClient, 'find', [], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional bad request error');
                expect(client.internalClient.findDataTables).to.have.callCount(1);
                expect(client.internalClient.findDataTables).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });
});
