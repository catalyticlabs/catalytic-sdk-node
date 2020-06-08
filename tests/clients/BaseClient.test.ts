import { expect } from 'chai';
import { readFileSync } from 'fs';
import nock from 'nock';
import { join, basename } from 'path';

import mock from '../helpers/mockEntities';
import CatalyticClient from '../../src/CatalyticClient';
import { BaseUri } from '../../src/constants';
import { InternalError, UnauthorizedError } from '../../src/errors';

describe('FileClient', function() {
    let client: CatalyticClient;
    let expectedCustomHeaders;

    before(function() {
        client = new CatalyticClient();
        client.credentials = mock.mockCredentials();
        expectedCustomHeaders = { authorization: `Bearer ${client.credentials.token}` };
    });

    after(function() {
        nock.restore();
    });

    describe('UploadFile', function() {
        it('should upload a File by ID', async function() {
            const response = mock.mockFileMetadataPage();
            let headers;
            let body;

            nock(BaseUri)
                .post('/api/files:upload')
                .reply(function(uri, requestBody) {
                    headers = this.req.headers;
                    body = requestBody;
                    return [201, response];
                });

            const filePath = join(__dirname, '../fixtures/test.txt');

            // this directly calls `BaseClient.prototype.uploadFile`
            const result = await client.fileClient.upload(filePath);

            expect(result).to.deep.equal(response.files[0]);

            expect(body)
                .to.include(`Content-Disposition: form-data`)
                .and.to.include('name="files"')
                .and.to.include(`filename="${basename(filePath)}"`)
                .and.to.include(readFileSync(filePath).toString());

            Object.keys(expectedCustomHeaders).forEach(k =>
                expect(headers).to.have.property(k, expectedCustomHeaders[k])
            );
        });

        it('should return expected error response when file fails to upload', async function() {
            nock(BaseUri)
                .post('/api/files:upload')
                .reply(500, 'Intentional server error');

            const filePath = join(__dirname, '../fixtures/test.txt');

            let err;
            let result;
            try {
                // this directly calls `BaseClient.prototype.uploadFile`
                result = await client.fileClient.upload(filePath);
            } catch (e) {
                err = e;
            }

            expect(result).to.not.be.ok;
            expect(err).to.be.ok;
            expect(err).to.be.instanceOf(InternalError);
            expect(err.message).to.include('Intentional server error');
        });

        it('should return auth error response on a 401', async function() {
            nock(BaseUri)
                .post('/api/files:upload')
                .reply(401, 'Intentional auth error');

            const filePath = join(__dirname, '../fixtures/test.txt');

            let err;
            let result;
            try {
                // this directly calls `BaseClient.prototype.uploadFile`
                result = await client.fileClient.upload(filePath);
            } catch (e) {
                err = e;
            }

            expect(result).to.not.be.ok;
            expect(err).to.be.ok;
            expect(err).to.be.instanceOf(UnauthorizedError);
            expect(err.message).to.include('Intentional auth error');
        });
    });
});
