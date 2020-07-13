import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import { InvalidAccessTokenError } from '../errors';

const TOKEN_DELIMITER = ':';
const ENV_VAR_NAME = 'CATALYTIC_TOKEN';

export default class AccessToken implements CatalyticSDKAPIModels.AccessToken {
    /**
     * The name of the AccessToken
     */
    name?: string;
    /**
     * The unique ID of the AccessToken
     */
    id: string;
    /**
     * The deserialized secret of the AccessToken
     */
    secret?: string;
    /**
     * The Domain of the Catalytic team with which these AccessToken are associated
     */
    domain: string;
    /**
     * The serialized AccessToken Token
     */
    token?: string;
    /**
     * The environment of the Catalytic team associated with the AccessToken
     */
    environment?: string;
    /**
     * The email address of the user to whom these AccessToken belong
     */
    owner?: string;
    /**
     * The "type" of the AccessToken. Possible values include:
     * 'user', 'actionWorker'
     */
    type?: AccessTokenType;

    /**
     * Construct an AccessToken class instance for an already created Access Token
     * @param token The serialized Access Token string, available on creation of new Access Token via UI or SDK
     */
    constructor(token: string) {
        const parts = Buffer.from(token, 'base64')
            .toString('utf8')
            .split(TOKEN_DELIMITER);
        if (parts.length !== 4) {
            throw new InvalidAccessTokenError('Invalid `token` string provided');
        }
        this.token = token;
        this.id = parts[0];
        this.secret = parts[1];
        this.domain = parts[2];
        this.environment = parts[3];
    }

    /**
     * Save the serialized token string of an AccessToken to a local file in the
     * default AccessTokens directory (`~/.catalytic/tokens)
     * @param fileName The name of the file to which the Access Token should be saved
     */
    public saveToFile(fileName: string);
    /**
     * Save the serialized token string of an AccessToken to a local file in the
     * provided directory
     * @param fileName The name of the file to which the Access Token should be saved
     * @param directoryPath The path to the directory on disk in which the file will be created
     */
    public saveToFile(fileName: string, directoryPath: string);
    public saveToFile(fileName: string, directoryPath?: string): void {
        if (!directoryPath) {
            directoryPath = AccessToken.DEFAULT_ACCESS_TOKEN_DIR;
        }
        if (!existsSync(directoryPath)) {
            mkdirSync(directoryPath, { recursive: true });
        }
        const path = join(directoryPath, fileName);
        if (existsSync(path)) {
            throw new InvalidAccessTokenError(`AccessToken at path '${path}' already exists`);
        }
        writeFileSync(path, this.token);
    }

    public static DEFAULT_ACCESS_TOKEN_DIR = getDefaultAccessTokensDirectory('tokens');

    /**
     * Gets the default AccessToken configured in this environment.
     * This first attempts to read the AccessToken from the CATALYTIC_TOKEN
     * env var. If that is not set, it then tries to read the token from
     * `~/.catalytic/tokens/default`. If not found,
     * an InvalidAccessTokenError will be thrown
     */
    static get default(): AccessToken {
        {
            try {
                return this.fromEnv();
            } catch {
                return this.fromFile('default');
            }
        }
    }

    /**
     * Create an AccessToken using the serialized token string provided in
     * the CATALYTIC_TOKEN environment variable
     *
     * @returns The created AccessToken
     */
    static fromEnv(): AccessToken {
        const token = process.env[ENV_VAR_NAME];
        if (!token) {
            throw new InvalidAccessTokenError(`'${ENV_VAR_NAME}' not set`);
        }
        return new AccessToken(token);
    }

    /**
     * Load an AccessToken saved to a local file on disk
     *
     * @param fileNameOrPath The file name or file path of the Access Token on disk. If provided value
     * does not resolve to a file on disk, the value will interpreted as a filename within the
     * default AccessTokens directory (`~/.catalytic/tokens`)
     *
     * @returns The created AccessToken
     */
    static fromFile(fileNameOrPath: string): AccessToken {
        const path = getPathFromFileNameOrPath(fileNameOrPath);

        if (existsSync(path)) {
            const token = readFileSync(path).toString();
            return new AccessToken(token);
        }
        throw new InvalidAccessTokenError(`Could not locate Access Token '${fileNameOrPath}'`);
    }

    /**
     * Fetch all Access Tokens saved in the default AccessTokens directory (`~/.catalytic/tokens`)
     * @returns An object of AccessTokens, keyed by file name
     */
    public static listAccessTokens(): { [name: string]: AccessToken };
    /**
     * Fetch all Access Tokens from the provided AccessTokens directory
     * @param directoryPath The path of the directory containing the AccessTokens
     * @returns An object of AccessTokens, keyed by file name
     */
    public static listAccessTokens(directoryPath: string): { [name: string]: AccessToken };
    public static listAccessTokens(directoryPath?: string): { [name: string]: AccessToken } {
        if (!directoryPath) {
            directoryPath = AccessToken.DEFAULT_ACCESS_TOKEN_DIR;
        }

        const files = readdirSync(directoryPath);
        return files.reduce((accessTokens, file) => {
            const token = readFileSync(join(directoryPath, file)).toString();
            accessTokens[file] = new AccessToken(token);
            return accessTokens;
        }, {});
    }

    /**
     * Delete a specific AccessToken from disk. Note that this does not permanently revoke the Access Token.
     * To permanently revoke an Access Token, use the Catalytic Web App
     * @param fileNameOrPath The file name or file path of the Access Token on disk. If provided value
     * does not resolve to a file on disk, the value will interpreted as a filename within the
     * default AccessTokens directory (`~/.catalytic/tokens`)
     */
    public static deleteAccessTokenFile(fileNameOrPath: string): void {
        const path = getPathFromFileNameOrPath(fileNameOrPath);
        if (!existsSync(path)) {
            throw new InvalidAccessTokenError(`No AccessToken found at path '${path}'`);
        }
        unlinkSync(path);
    }
}

export enum AccessTokenType {
    user = 'user'
}

function getDefaultAccessTokensDirectory(subDirectory: string): string {
    const path = join(homedir(), '.catalytic', subDirectory);
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
    }
    return path;
}

function getPathFromFileNameOrPath(fileNameOrPath: string): string {
    return existsSync(fileNameOrPath) ? fileNameOrPath : join(AccessToken.DEFAULT_ACCESS_TOKEN_DIR, fileNameOrPath);
}
