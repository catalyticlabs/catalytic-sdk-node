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
        const id = v4();
        const mockFile = mock.mockFileMetadata();
        let headers;
        mockApi.get(`/api/files/${id}`).reply(function() {
            headers = this.req.headers;
            return [200, mockFile];
        });

        const client = new CatalyticClient();
        client.credentials = mock.mockCredentials();

        const result = await client.fileClient.get(id);

        expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockFile)));
        expect(headers.authorization).to.be.ok.and.to.include(`Bearer ${client.credentials.token}`);
    });

    it('should return proper exception when File not found', async function() {
        const id = v4();
        let headers;
        mockApi.get(`/api/files/${id}`).reply(function() {
            headers = this.req.headers;
            return [404, { detail: 'Not found or something' }];
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
        expect(error.message).to.include('Not found or something');
        expect(headers.authorization).to.be.ok.and.to.include(`Bearer ${client.credentials.token}`);
    });
});
