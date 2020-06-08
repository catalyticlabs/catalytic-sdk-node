import * as msRest from '@azure/ms-rest-js';
import axios from 'axios';
import FormData from 'form-data';
import { readFile } from 'fs';
import { basename } from 'path';
import { promisify } from 'util';

import { CatalyticSDKAPI } from '../internal/lib/catalyticSDKAPI';
import { CredentialsProvider } from '../entities/Credentials';
import { FileMetadata } from '../entities';
import { InvalidCredentialsError, UnauthorizedError, ResourceNotFoundError, InternalError } from '../errors';
import { BaseUri, UserAgent } from '../constants';

export default abstract class BaseClient {
    static entity: string;

    protected internalClient: CatalyticSDKAPI;
    protected credentialsProvider: CredentialsProvider;

    constructor(internalClient: CatalyticSDKAPI, credentialsProvider: CredentialsProvider) {
        this.internalClient = internalClient;
        this.credentialsProvider = credentialsProvider;
    }

    protected getRequestHeaders(): { [headerName: string]: string } {
        const credentials = this.credentialsProvider.credentials;
        if (!credentials) {
            throw new InvalidCredentialsError('No Credentials provided');
        }
        return {
            Authorization: `Bearer ${credentials.token}`
        };
    }

    protected async uploadFile(filePath: string): Promise<FileMetadata> {
        const headers = this.getRequestHeaders();

        const fileContents = await promisify(readFile)(filePath);
        const form = new FormData();
        form.append('files', fileContents, basename(filePath));

        try {
            const result = await axios.post(`${BaseUri}api/files:upload`, form, {
                headers: { ...headers, ...form.getHeaders(), 'User-Agent': UserAgent }
            });
            if (result.data?.files[0]) {
                return result.data.files[0] as FileMetadata;
            }
        } catch (err) {
            if (err.response?.status) {
                const status = err.response.status;
                const data = err.response.data;
                // clean this up after https://github.com/catalyticlabs/catalytic-sdk-node/issues/3 is closed
                const message = data ? data.Detail || data.detail || data : 'Failed to upload file';

                this.throwError(message, status);
            }
        }

        throw new InternalError('Failed to upload file');
    }

    protected parseResponse<T>(response: InternalAPIResponse): T {
        if (response._response.status >= 400) {
            this.handleError(response);
        }
        return response._response.parsedBody as T;
    }

    private handleError(response: InternalAPIResponse): void {
        let detail = '';
        try {
            // ProblemDetails responses can come back with Pascal cased JSON, so casting may drop properties
            const problemDetails = JSON.parse(response._response.bodyAsText);
            // clean this up after https://github.com/catalyticlabs/catalytic-sdk-node/issues/3 is closed
            detail = problemDetails.detail || problemDetails.Detail || response._response.bodyAsText;
        } catch (e) {
            detail = response._response.bodyAsText;
        }
        this.throwError(detail, response._response.status);
    }

    private throwError(message: string, status: number): void {
        switch (status) {
            case 401:
                throw new UnauthorizedError(message);
            case 404:
                throw new ResourceNotFoundError(message, this.constructor['entity']);
            default:
                throw new InternalError(message);
        }
    }
}

export interface FindOptions {
    /**
     * Free text query terms to search for
     */
    query?: string;
    /**
     * The token representing the result page to get
     */
    pageToken?: string;
    /**
     * The page size requested
     */
    pageSize?: number;
}

export interface ClientMethodCallback<TResult> {
    /**
     * A method that will be invoked as a callback to a service function.
     * @param {Error | null} err The error occurred, if any; otherwise null.
     * @param {TResult} [result] The result if an error did not occur.
     */
    (err: Error | null, result?: TResult): void;
}

export interface InternalAPIResponse {
    body: any;
    // this is the type returned from all requests via generated methods
    _response: msRest.HttpResponse & {
        bodyAsText: string;
        parsedBody: any;
    };
}
