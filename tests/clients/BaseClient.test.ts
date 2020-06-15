import { expect } from 'chai';
import { readFileSync, createReadStream } from 'fs';
import nock from 'nock';
import { tmpdir } from 'os';
import { join, basename } from 'path';
import { v4 } from 'uuid';

import mock from '../helpers/mockEntities';
import CatalyticClient from '../../src/CatalyticClient';
import { BaseUri } from '../../src/constants';
import { InternalError, UnauthorizedError, InvalidCredentialsError } from '../../src/errors';

describe('BaseClient', function() {
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

    describe('GetRequestHeaders', function() {
        it('should attach Token via Bearer auth header', function() {
            const headers = client.fileClient['getRequestHeaders']();
            expect(headers).to.have.property('Authorization', `Bearer ${client.credentials.token}`);
        });

        it('should throw InvalidCredentialsError if no Credentials attached to client', function() {
            const originalCredentials = client.credentials;
            client.credentials = null;

            let err;
            try {
                client.fileClient['getRequestHeaders']();
            } catch (e) {
                err = e;
            }
            expect(err).to.be.ok.and.to.be.instanceOf(InvalidCredentialsError);
            expect(err.message).to.equal('No Credentials provided');

            client.credentials = originalCredentials;
        });
    });

    describe('UploadFile', function() {
        it('should upload a File from a local path', async function() {
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
            const result = await client.fileClient['uploadFile'](filePath);

            expect(result).to.deep.equal(response);

            expect(body)
                .to.include(`Content-Disposition: form-data`)
                .and.to.include('name="files"')
                .and.to.include(`filename="${basename(filePath)}"`)
                .and.to.include(readFileSync(filePath).toString());

            Object.keys(expectedCustomHeaders).forEach(k =>
                expect(headers).to.have.property(k, expectedCustomHeaders[k])
            );
        });

        it('should upload a File from a local path using the passed endpoint', async function() {
            const response = mock.mockFileMetadataPage();
            let headers;
            let body;

            nock(BaseUri)
                .post('/api/custom/endpoint')
                .reply(function(uri, requestBody) {
                    headers = this.req.headers;
                    body = requestBody;
                    return [201, response];
                })
                .persist();

            const filePath = join(__dirname, '../fixtures/test.txt');

            function verify(result): void {
                expect(result).to.deep.equal(response);

                expect(body)
                    .to.include(`Content-Disposition: form-data`)
                    .and.to.include('name="files"')
                    .and.to.include(`filename="${basename(filePath)}"`)
                    .and.to.include(readFileSync(filePath).toString());

                Object.keys(expectedCustomHeaders).forEach(k =>
                    expect(headers).to.have.property(k, expectedCustomHeaders[k])
                );
            }

            // this directly calls `BaseClient.prototype.uploadFile`
            verify(await client.fileClient['uploadFile'](filePath, '/custom/endpoint'));
            verify(await client.fileClient['uploadFile'](filePath, 'custom/endpoint'));
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
                result = await client.fileClient['uploadFile'](filePath);
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
                result = await client.fileClient['uploadFile'](filePath);
            } catch (e) {
                err = e;
            }

            expect(result).to.not.be.ok;
            expect(err).to.be.ok;
            expect(err).to.be.instanceOf(UnauthorizedError);
            expect(err.message).to.include('Intentional auth error');
        });
    });

    describe('Get File Download Stream', function() {
        it('should get a file download stream', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const stream = createReadStream(filePath);
            const endpoint = '/download/something';

            let headers;

            nock(BaseUri)
                .get('/api' + endpoint)
                .reply(function() {
                    headers = this.req.headers;
                    return [200, stream];
                });

            // this directly calls `BaseClient.prototype.getFileDownloadStream`
            const result = await client.fileClient['getFileDownloadStream'](endpoint);

            const chunks = [];
            await new Promise((resolve, reject) => {
                result.on('data', chunk => chunks.push(chunk));
                result.on('error', reject);
                result.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
            });

            expect(chunks.join('')).to.deep.equal(readFileSync(filePath).toString());

            Object.keys(expectedCustomHeaders).forEach(k =>
                expect(headers).to.have.property(k, expectedCustomHeaders[k])
            );
        });

        it('should return expected error response when file fails to upload', async function() {
            const endpoint = '/download/something';

            nock(BaseUri)
                .get('/api' + endpoint)
                .reply(500, 'Intentional server error');

            let err;
            try {
                // this directly calls `BaseClient.prototype.getFileDownloadStream`
                await client.fileClient['getFileDownloadStream'](endpoint);
            } catch (e) {
                err = e;
            }

            expect(err).to.be.ok;
            expect(err).to.be.instanceOf(InternalError);
            expect(err.message).to.include('Intentional server error');
        });

        it('should return auth error response on a 401', async function() {
            const endpoint = '/download/something';

            nock(BaseUri)
                .get('/api' + endpoint)
                .reply(401, 'Intentional auth error');

            let err;
            try {
                // this directly calls `BaseClient.prototype.getFileDownloadStream`
                await client.fileClient['getFileDownloadStream'](endpoint);
            } catch (e) {
                err = e;
            }

            expect(err).to.be.ok;
            expect(err).to.be.instanceOf(UnauthorizedError);
            expect(err.message).to.include('Intentional auth error');
        });
    });

    describe('Download File', function() {
        it('should download a file', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const stream = createReadStream(filePath);
            const endpoint = '/download/something';
            const writePath = join(tmpdir(), v4());

            let headers;

            nock(BaseUri)
                .get('/api' + endpoint)
                .reply(function() {
                    headers = this.req.headers;
                    return [200, stream];
                });

            // this directly calls `BaseClient.prototype.downloadFile`
            await client.fileClient['downloadFile'](endpoint, writePath);

            expect(readFileSync(writePath).toString()).to.deep.equal(readFileSync(filePath).toString());

            Object.keys(expectedCustomHeaders).forEach(k =>
                expect(headers).to.have.property(k, expectedCustomHeaders[k])
            );
        });

        it('should return expected error response when file fails to upload', async function() {
            const endpoint = '/download/something';
            const writePath = join(tmpdir(), v4());

            nock(BaseUri)
                .get('/api' + endpoint)
                .reply(500, 'Intentional server error');

            let err;
            try {
                // this directly calls `BaseClient.prototype.downloadFile`
                await client.fileClient['downloadFile'](endpoint, writePath);
            } catch (e) {
                err = e;
            }

            expect(err).to.be.ok;
            expect(err).to.be.instanceOf(InternalError);
            expect(err.message).to.include('Intentional server error');
        });

        it('should return auth error response on a 401', async function() {
            const endpoint = '/download/something';
            const writePath = join(tmpdir(), v4());

            nock(BaseUri)
                .get('/api' + endpoint)
                .reply(401, 'Intentional auth error');

            let err;
            try {
                // this directly calls `BaseClient.prototype.downloadFile`
                await client.fileClient['downloadFile'](endpoint, writePath);
            } catch (e) {
                err = e;
            }

            expect(err).to.be.ok;
            expect(err).to.be.instanceOf(UnauthorizedError);
            expect(err.message).to.include('Intentional auth error');
        });
    });
});
