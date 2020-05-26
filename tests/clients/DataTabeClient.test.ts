import { expect } from 'chai';
import { v4 } from 'uuid';

import nockApi from '../nockApi';
import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';

describe('DataTableClient', function() {
    let mockApi;

    before(function() {
        mockApi = nockApi();
    });

    describe('Get DataTable', function() {
        it('should get a DataTable by ID', async function() {
            const mockDataTable = mock.mockDataTable();
            let headers;
            mockApi.get(`/api/tables/${mockDataTable.id}`).reply(function() {
                headers = this.req.headers;
                return [200, mockDataTable];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.dataTableClient.get(mockDataTable.id);

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTable)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should return proper exception when DataTable not found', async function() {
            const id = v4();
            let headers;
            mockApi.get(`/api/tables/${id}`).reply(function() {
                headers = this.req.headers;
                return [404, { detail: 'Not found or something' }];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            let error;
            let result;

            try {
                result = await client.dataTableClient.get(id);
            } catch (e) {
                error = e;
            }

            expect(result).to.not.be.ok;
            expect(error).to.be.ok; //.and.to.be.DataTableOf(InternalError);
            expect(error.message).to.include('Not found or something');
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });
    });
    describe('Find DataTables', function() {
        it('should find tables with no arguments', async function() {
            const mockDataTablesPage = mock.mockDataTablesPage();
            let headers;
            mockApi.get(`/api/tables`).reply(function() {
                headers = this.req.headers;
                return [200, mockDataTablesPage];
            });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.dataTableClient.find();

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTablesPage)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });

        it('should find tables with no options', async function() {
            const mockDataTablesPage = mock.mockDataTablesPage();
            const options = { pageSize: 3, query: 'some table' };
            let headers;
            mockApi
                .get(`/api/tables`)
                // eslint-disable-next-line @typescript-eslint/camelcase
                .query({ page_size: options.pageSize, query: options.query })
                .reply(function() {
                    headers = this.req.headers;
                    return [200, mockDataTablesPage];
                });

            const client = new CatalyticClient();
            client.credentials = mock.mockCredentials();

            const result = await client.dataTableClient.find(options);

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockDataTablesPage)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);
        });
    });
});
