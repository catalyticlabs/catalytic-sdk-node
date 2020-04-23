import { expect } from 'chai';
import { v4 } from 'uuid';

import nockApi from '../nockApi';
import CatalyticClient from '../../src/CatalyticClient';
import mock from '../helpers/mockEntities';

describe('UserClient', function() {
    let mockApi;

    before(function() {
        mockApi = nockApi();
    });

    it('should get a User by ID', async function() {
        const id = v4();
        const mockUser = mock.mockUser();
        let headers;
        mockApi.get(`/api/users/${id}`).reply(function() {
            headers = this.req.headers;
            return [200, mockUser];
        });

        const client = new CatalyticClient();
        client.credentials = mock.mockCredentials();

        const result = await client.userClient.get(id);

        expect(result).to.deep.equal(JSON.parse(JSON.stringify(mockUser)));
        expect(headers.authorization).to.be.ok.and.to.include(`Bearer ${client.credentials.token}`);
    });

    it('should return proper exception when User not found', async function() {
        const id = v4();
        let headers;
        mockApi.get(`/api/users/${id}`).reply(function() {
            headers = this.req.headers;
            return [404, { detail: 'Not found or something' }];
        });

        const client = new CatalyticClient();
        client.credentials = mock.mockCredentials();

        let error;
        let result;

        try {
            result = await client.userClient.get(id);
        } catch (e) {
            error = e;
        }

        expect(result).to.not.be.ok;
        expect(error).to.be.ok;
        expect(error.message).to.include('Not found or something');
        expect(headers.authorization).to.be.ok.and.to.include(`Bearer ${client.credentials.token}`);
    });
});
