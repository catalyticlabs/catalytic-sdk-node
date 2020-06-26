import { expect } from 'chai';

import CatalyticClient from '../src/CatalyticClient';
import { InvalidAccessTokenError } from '../src/errors';

import { mockAccessToken } from './helpers/mockEntities';
import { AccessToken } from '../src/entities';

describe('CatalyticClient', function() {
    it('should take an Access Token in the constructor', function() {
        const accessToken = mockAccessToken();

        let client = new CatalyticClient(accessToken);
        expect(client.accessToken.token).to.equal(accessToken.token);

        client = new CatalyticClient(accessToken.token);
        expect(client.accessToken.token).to.equal(accessToken.token);
    });

    it('should set accessToken via setAccessToken function', function() {
        const accessToken = mockAccessToken();

        let client = new CatalyticClient();
        client.setAccessToken(accessToken);
        expect(client.accessToken.token).to.equal(accessToken.token);

        client = new CatalyticClient();
        client.setAccessToken(accessToken.token);
        expect(client.accessToken.token).to.equal(accessToken.token);
    });

    it('should throw error if attempting to set invalid Access Token', function() {
        const badAccessToken = {};

        expect(() => new CatalyticClient(badAccessToken as AccessToken)).to.throw(InvalidAccessTokenError);

        const client = new CatalyticClient();
        expect(() => client.setAccessToken(badAccessToken as AccessToken)).to.throw(InvalidAccessTokenError);
    });
});