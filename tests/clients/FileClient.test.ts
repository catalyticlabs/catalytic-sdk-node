import chai from 'chai';
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

describe('FileClient', function() {
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

    describe('Get File', function() {
        it('should get a File by ID', async function() {
            const mockFileMetadata = mock.mockFileMetadata();
            sinon
                .stub(client.internalClient, 'getFile')
                .callsFake(() => Promise.resolve(createResponse(mockFileMetadata)));

            return executeTest(client.fileClient, 'get', [mockFileMetadata.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockFileMetadata)));
                expect(client.internalClient.getFile).to.have.callCount(1);
                expect(client.internalClient.getFile).to.have.been.calledWith(mockFileMetadata.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when File not found', async function() {
            const id = v4();
            sinon
                .stub(client.internalClient, 'getFile')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.fileClient, 'get', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error).to.be.instanceOf(ResourceNotFoundError);
                expect(error.message)
                    .to.include('Intentional not found error')
                    .and.to.include('File');
                expect(client.internalClient.getFile).to.have.callCount(1);
                expect(client.internalClient.getFile).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Upload File', function() {
        it('should upload a File by ID', async function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            const mockFileMetadata = mock.mockFileMetadata();
            // stubbing protected method on BaseClient, which is called by FileClient.upload
            const stub = sinon
                .stub(client.fileClient, 'uploadFile' as any)
                .callsFake(() => Promise.resolve(mockFileMetadata));

            return executeTest(client.fileClient, 'upload', [filePath], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockFileMetadata)));
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(filePath);
            });
        });

        it('should return expected error response when file fails to upload', function() {
            const filePath = join(__dirname, '../fixtures/test.txt');
            // stubbing protected method on BaseClient, which is called by FileClient.upload
            const stub = sinon.stub(client.fileClient, 'uploadFile' as any).callsFake(() => {
                throw new InternalError('Intentional server error');
            });

            return executeTest(client.fileClient, 'upload', [filePath], (err, result) => {
                expect(result).to.not.be.ok;
                expect(err).to.be.ok;
                expect(err).to.be.instanceOf(InternalError);
                expect(err.message).to.include('Intentional server error');
                expect(stub).to.have.callCount(1);
                expect(stub).to.have.been.calledWith(filePath);
            });
        });
    });
});
