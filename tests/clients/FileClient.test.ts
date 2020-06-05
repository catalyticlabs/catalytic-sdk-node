import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';
import { createResponse, executeTest } from '../helpers';

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

    it('should get a File by ID', async function() {
        const mockFileMetadata = mock.mockFileMetadata();
        sinon.stub(client.internalClient, 'getFile').callsFake(() => Promise.resolve(createResponse(mockFileMetadata)));

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
            expect(error.message).to.include('Intentional not found error');
            expect(client.internalClient.getFile).to.have.callCount(1);
            expect(client.internalClient.getFile).to.have.been.calledWith(id, {
                customHeaders: expectedCustomHeaders
            });
        });
    });
});
