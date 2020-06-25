import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 } from 'uuid';

chai.use(sinonChai);
const expect = chai.expect;

import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';
import { createResponse, executeTest } from '../helpers';

describe('UserClient', function() {
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

    describe('Get User', function() {
        it('should get a User by ID', async function() {
            const mockUser = mock.mockUser();
            sinon.stub(client._internalClient, 'getUser').callsFake(() => Promise.resolve(createResponse(mockUser)));

            return executeTest(client.users, 'get', [mockUser.id], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockUser)));
                expect(client._internalClient.getUser).to.have.callCount(1);
                expect(client._internalClient.getUser).to.have.been.calledWith(mockUser.id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should return proper exception when User not found', async function() {
            const id = v4();
            sinon
                .stub(client._internalClient, 'getUser')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional not found error' }, 404)));

            return executeTest(client.users, 'get', [id], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional not found error');
                expect(client._internalClient.getUser).to.have.callCount(1);
                expect(client._internalClient.getUser).to.have.been.calledWith(id, {
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });

    describe('Find Users', function() {
        it('should find DataTables with no filter options', async function() {
            const mockUsersPage = mock.mockUsersPage();
            sinon
                .stub(client._internalClient, 'findUsers')
                .callsFake(() => Promise.resolve(createResponse(mockUsersPage)));

            return executeTest(client.users, 'find', [], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockUsersPage)));
                expect(client._internalClient.findUsers).to.have.callCount(1);
                expect(client._internalClient.findUsers).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });

        it('should find DataTables with filter options', async function() {
            const options = { pageSize: 3, query: 'some table' };
            const mockUsersPage = mock.mockUsersPage();
            sinon
                .stub(client._internalClient, 'findUsers')
                .callsFake(() => Promise.resolve(createResponse(mockUsersPage)));

            return executeTest(client.users, 'find', [options], (err, result) => {
                expect(err).to.not.be.ok;

                expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockUsersPage)));
                expect(client._internalClient.findUsers).to.have.callCount(1);
                expect(client._internalClient.findUsers).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders,
                    ...options
                });
            });
        });

        it('should return exception when bad response code returned', async function() {
            sinon
                .stub(client._internalClient, 'findUsers')
                .callsFake(() => Promise.resolve(createResponse({ detail: 'Intentional bad request error' }, 400)));

            return executeTest(client.users, 'find', [], (error, result) => {
                expect(result).to.not.be.ok;
                expect(error).to.be.ok;
                expect(error.message).to.include('Intentional bad request error');
                expect(client._internalClient.findUsers).to.have.callCount(1);
                expect(client._internalClient.findUsers).to.have.been.calledWith({
                    customHeaders: expectedCustomHeaders
                });
            });
        });
    });
});
