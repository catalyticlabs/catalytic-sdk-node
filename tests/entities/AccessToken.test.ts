import { expect } from 'chai';
import { mkdirSync, readFileSync, existsSync, rmdirSync, readdirSync, unlinkSync } from 'fs';
import { homedir, tmpdir } from 'os';
import { join } from 'path';
import { v4 } from 'uuid';

import { AccessToken } from '../../src/entities';
import { getDefaultAccessTokensDirectory } from '../../src/entities/AccessToken';
import { InvalidAccessTokenError, AccessTokenNameConflictError } from '../../src/errors';

import mock from '../helpers/mockEntities';

// don't use rmdirSync with recursive option, since that doesn't work in node 10
function deleteDirectory(path: string): void {
    if (!existsSync(path)) {
        return;
    }
    readdirSync(path).forEach(file => unlinkSync(join(path, file)));
    rmdirSync(path);
}

describe('AccessToken', function() {
    let customDir;
    let _defaultAccessTokenDir;
    before(function() {
        _defaultAccessTokenDir = AccessToken.DEFAULT_ACCESS_TOKEN_DIR;
        AccessToken.DEFAULT_ACCESS_TOKEN_DIR = join(tmpdir(), 'tokens');
        customDir = join(tmpdir(), 'custom');
    });

    beforeEach(function() {
        if (!existsSync(AccessToken.DEFAULT_ACCESS_TOKEN_DIR)) {
            mkdirSync(AccessToken.DEFAULT_ACCESS_TOKEN_DIR);
        }
    });

    afterEach(function() {
        process.env.CATALYTIC_TOKEN = '';
        deleteDirectory(AccessToken.DEFAULT_ACCESS_TOKEN_DIR);
        deleteDirectory(customDir);
    });

    after(function() {
        AccessToken.DEFAULT_ACCESS_TOKEN_DIR = _defaultAccessTokenDir;
    });

    describe('AccessToken instances', function() {
        describe('construction', function() {
            it('should properly parse an Access Token', function() {
                const mockToken = mock.mockAccessToken();
                const accessToken = new AccessToken(mockToken.token);

                ['token', 'id', 'secret', 'domain', 'environment'].forEach(property =>
                    expect(accessToken[property]).to.equal(mockToken[property])
                );
            });

            it('should throw an error for an invalid token', function() {
                expect(() => new AccessToken('INVALID_TOKEN')).to.throw(InvalidAccessTokenError);
            });
        });

        describe('saveToFile', function() {
            it('should save a token to a file in the default directory', function() {
                const token = new AccessToken(mock.mockAccessToken().token);
                token.saveToFile('my-token');

                expect(readFileSync(join(AccessToken.DEFAULT_ACCESS_TOKEN_DIR, 'my-token')).toString()).to.equal(
                    token.token
                );
            });

            it('should save a token to a file in a custom directory', function() {
                const token = new AccessToken(mock.mockAccessToken().token);
                token.saveToFile('my-token', customDir);

                expect(readFileSync(join(customDir, 'my-token')).toString()).to.equal(token.token);
            });

            it('should throw error if file already exists', function() {
                const token = new AccessToken(mock.mockAccessToken().token);
                token.saveToFile('my-token');

                expect(readFileSync(join(AccessToken.DEFAULT_ACCESS_TOKEN_DIR, 'my-token')).toString()).to.equal(
                    token.token
                );

                const token2 = new AccessToken(mock.mockAccessToken().token);
                expect(() => token2.saveToFile('my-token')).to.throw(AccessTokenNameConflictError);
            });
        });
    });

    describe('AccessToken static methods', function() {
        describe('fromEnv', function() {
            it('should construct new AccessToken from serialized string in environment variable', function() {
                const mockToken = mock.mockAccessToken();
                process.env.CATALYTIC_TOKEN = mockToken.token;
                const accessToken = AccessToken.fromEnv();

                ['token', 'id', 'secret', 'domain', 'environment'].forEach(property =>
                    expect(accessToken[property]).to.equal(mockToken[property])
                );
            });
            it('should throw InvalidAccessTokenError if env var not set', function() {
                process.env.CATALYTIC_TOKEN = '';

                let err;
                let token;

                try {
                    token = AccessToken.fromEnv();
                } catch (e) {
                    err = e;
                }

                expect(token).to.not.be.ok;
                expect(err).to.be.ok.and.to.be.instanceOf(InvalidAccessTokenError);
                expect(err.message).to.include(`'CATALYTIC_TOKEN' not set`);
            });
        });

        describe('fromFile', function() {
            it('should read file from default directory', function() {
                const token1 = new AccessToken(mock.mockAccessToken().token);
                token1.saveToFile('my-token');

                const token2 = AccessToken.fromFile('my-token');
                ['token', 'id', 'secret', 'domain', 'environment'].forEach(property =>
                    expect(token2[property]).to.equal(token1[property])
                );
            });

            it('should read file from custom directory', function() {
                const token1 = new AccessToken(mock.mockAccessToken().token);
                token1.saveToFile('my-token', customDir);

                const token2 = AccessToken.fromFile(join(customDir, 'my-token'));
                ['token', 'id', 'secret', 'domain', 'environment'].forEach(property =>
                    expect(token2[property]).to.equal(token1[property])
                );
            });
            it('should throw InvalidAccessTokenError if file does not exist', function() {
                expect(() => AccessToken.fromFile('non-existent-file')).to.throw(InvalidAccessTokenError);
                expect(() => AccessToken.fromFile(join(tmpdir(), 'non-existent-file'))).to.throw(
                    InvalidAccessTokenError
                );
            });
        });

        describe('default', function() {
            it('should use the env var if present', function() {
                const mockToken = mock.mockAccessToken();
                new AccessToken(mock.mockAccessToken().token).saveToFile('default');

                process.env.CATALYTIC_TOKEN = mockToken.token;
                const accessToken = AccessToken.default;

                ['token', 'id', 'secret', 'domain', 'environment'].forEach(property =>
                    expect(accessToken[property]).to.equal(mockToken[property])
                );
                process.env.CATALYTIC_TOKEN = undefined;
            });
            it('should use the default file if env var not present', function() {
                const mockToken = mock.mockAccessToken();
                new AccessToken(mockToken.token).saveToFile('default');

                const accessToken = AccessToken.default;

                ['token', 'id', 'secret', 'domain', 'environment'].forEach(property =>
                    expect(accessToken[property]).to.equal(mockToken[property])
                );
            });
            it('should throw InvalidAccessTokenError if neither option present', function() {
                expect(() => AccessToken.default).to.throw(InvalidAccessTokenError);
            });
        });

        describe('listAccessTokens', function() {
            it('should list all AccessTokens in default dir', function() {
                const token1 = mock.mockAccessToken();
                new AccessToken(token1.token).saveToFile('token1');
                const token2 = mock.mockAccessToken();
                new AccessToken(token2.token).saveToFile('token2');
                const token3 = mock.mockAccessToken();
                new AccessToken(token3.token).saveToFile('token3');

                const tokens = AccessToken.listAccessTokens();
                expect(tokens).to.deep.equal({ token1, token2, token3 });
            });
            it('should list all AccessTokens in custom dir', function() {
                const token1 = mock.mockAccessToken();
                new AccessToken(token1.token).saveToFile('token1', customDir);
                const token2 = mock.mockAccessToken();
                new AccessToken(token2.token).saveToFile('token2', customDir);
                const token3 = mock.mockAccessToken();
                new AccessToken(token3.token).saveToFile('token3', customDir);

                const tokens = AccessToken.listAccessTokens(customDir);
                expect(tokens).to.deep.equal({ token1, token2, token3 });
            });
        });

        describe('deleteAccessTokenFile', function() {
            it('should delete AccessToken from default dir', function() {
                const token1 = mock.mockAccessToken();
                new AccessToken(token1.token).saveToFile('token1');

                expect(AccessToken.fromFile('token1')).to.deep.equal(token1);

                AccessToken.deleteAccessTokenFile('token1');
                expect(() => AccessToken.fromFile('token1')).to.throw(InvalidAccessTokenError);
            });
            it('should delete AccessToken from custom dir', function() {
                const token1 = mock.mockAccessToken();
                new AccessToken(token1.token).saveToFile('token1', customDir);

                expect(AccessToken.fromFile(join(customDir, 'token1'))).to.deep.equal(token1);

                AccessToken.deleteAccessTokenFile(join(customDir, 'token1'));
                expect(() => AccessToken.fromFile(join(customDir, 'token1'))).to.throw(InvalidAccessTokenError);
            });
            it('should throw error if AccessToken does not exist', function() {
                expect(() => AccessToken.deleteAccessTokenFile('token-that-does-not-exist')).to.throw(
                    InvalidAccessTokenError
                );
            });
        });
    });

    describe('getDefaultAccessTokensDirectory', function() {
        it('should create directory if does not exist', function() {
            const subDirectoryName = v4();
            const expectedFullPath = join(homedir(), '.catalytic', subDirectoryName);
            expect(existsSync(expectedFullPath)).to.be.false;

            const path = getDefaultAccessTokensDirectory(subDirectoryName);

            expect(path).to.equal(expectedFullPath);
            expect(existsSync(expectedFullPath)).to.be.true;

            deleteDirectory(path);
        });
    });
});
