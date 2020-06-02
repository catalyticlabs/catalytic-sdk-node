import assert from 'assert';
import { expect } from 'chai';
import { v4 } from 'uuid';

import nockApi from '../nockApi';
import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';

describe('FileClient', function() {
    let mockApi;

    before(function() {
        mockApi = nockApi();
    });

    it('should get a File by ID', async function() {
        const mockFile = mock.mockFileMetadata();
        let headers;
        mockApi.get(`/api/files/${mockFile.id}`).reply(function() {
            headers = this.req.headers;
            return [200, mockFile];
        });

        const client = new CatalyticClient();
        client.credentials = mock.mockCredentials();

        const result = await client.fileClient.get(mockFile.id);

        expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockFile)));
        expect(headers.authorization)
            .to.be.an('array')
            .that.includes(`Bearer ${client.credentials.token}`);
    });

    it('should get a File by ID with callback', function(done) {
        const mockFile = mock.mockFileMetadata();
        let headers;
        mockApi.get(`/api/files/${mockFile.id}`).reply(function() {
            headers = this.req.headers;
            return [200, mockFile];
        });

        const client = new CatalyticClient();
        client.credentials = mock.mockCredentials();

        client.fileClient.get(mockFile.id, (err, result) => {
            assert.ifError(err);

            expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockFile)));
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);

            done();
        });
    });

    it('should return proper exception when File not found', async function() {
        const id = v4();
        let headers;
        mockApi.get(`/api/files/${id}`).reply(function() {
            headers = this.req.headers;
            return [404, { detail: 'Intentional not found error' }];
        });

        const client = new CatalyticClient();
        client.credentials = mock.mockCredentials();

        let error;
        let result;

        try {
            result = await client.fileClient.get(id);
        } catch (e) {
            error = e;
        }

        expect(result).to.not.be.ok;
        expect(error).to.be.ok; //.and.to.be.FileOf(InternalError);
        expect(error.message).to.include('Intentional not found error');
        expect(headers.authorization)
            .to.be.an('array')
            .that.includes(`Bearer ${client.credentials.token}`);
    });

    it('should return proper exception when File not found with callback', function(done) {
        const id = v4();
        let headers;
        mockApi.get(`/api/files/${id}`).reply(function() {
            headers = this.req.headers;
            return [404, { detail: 'Intentional not found error' }];
        });

        const client = new CatalyticClient();
        client.credentials = mock.mockCredentials();

        client.fileClient.get(id, (error, result) => {
            expect(result).to.not.be.ok;
            expect(error).to.be.ok; //.and.to.be.FileOf(InternalError);
            expect(error.message).to.include('Intentional not found error');
            expect(headers.authorization)
                .to.be.an('array')
                .that.includes(`Bearer ${client.credentials.token}`);

            done();
        });
    });
});
