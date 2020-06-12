import * as msRest from '@azure/ms-rest-js';
import axios from 'axios';
import FormData from 'form-data';
import { readFile, createWriteStream } from 'fs';
import { basename } from 'path';
import { Stream } from 'stream';
import { promisify, callbackify } from 'util';

import { CatalyticSDKAPI } from '../internal/lib/catalyticSDKAPI';
import { CredentialsProvider } from '../entities/Credentials';
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

    protected async uploadFile<T>(filePath: string, endpoint = 'files:upload'): Promise<T> {
        const url = `${BaseUri}api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

        const headers = this.getRequestHeaders();

        const fileContents = await promisify(readFile)(filePath);
        const form = new FormData();
        form.append('files', fileContents, basename(filePath));

        try {
            const result = await axios.post(url, form, {
                headers: { ...headers, ...form.getHeaders(), 'User-Agent': UserAgent }
            });
            if (result.data) {
                return result.data;
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

    protected async getFileDownloadStream(endpoint: string): Promise<Stream> {
        const url = `${BaseUri}api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

        try {
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream',
                headers: this.getRequestHeaders()
            });

            return response.data as Stream;
        } catch (err) {
            if (err.response?.status) {
                const status = err.response.status;
                const chunks = [];
                const stream = err.response.data;
                await new Promise((resolve, reject) => {
                    stream.on('data', chunk => chunks.push(chunk));
                    stream.on('error', reject);
                    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
                });
                const message = chunks.join('') || 'Failed to get download stream';

                this.throwError(message, status);
            }
        }

        throw new InternalError('Failed to get download stream');
    }

    protected async downloadFile(endpoint: string, path: string): Promise<void> {
        const writer = createWriteStream(path);
        const stream = await this.getFileDownloadStream(endpoint);
        stream.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
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

    protected callbackifyBound(fn: () => Promise<void>): (callback: (err: NodeJS.ErrnoException) => void) => void;
    protected callbackifyBound<TResult>(
        fn: () => Promise<TResult>
    ): (callback: (err: NodeJS.ErrnoException, result: TResult) => void) => void;
    protected callbackifyBound<T1>(
        fn: (arg1: T1) => Promise<void>
    ): (arg1: T1, callback: (err: NodeJS.ErrnoException) => void) => void;
    protected callbackifyBound<T1, TResult>(
        fn: (arg1: T1) => Promise<TResult>
    ): (arg1: T1, callback: (err: NodeJS.ErrnoException, result: TResult) => void) => void;
    protected callbackifyBound<T1, T2>(
        fn: (arg1: T1, arg2: T2) => Promise<void>
    ): (arg1: T1, arg2: T2, callback: (err: NodeJS.ErrnoException) => void) => void;
    protected callbackifyBound<T1, T2, TResult>(
        fn: (arg1: T1, arg2: T2) => Promise<TResult>
    ): (arg1: T1, arg2: T2, callback: (err: NodeJS.ErrnoException | null, result: TResult) => void) => void;
    protected callbackifyBound<T1, T2, T3>(
        fn: (arg1: T1, arg2: T2, arg3: T3) => Promise<void>
    ): (arg1: T1, arg2: T2, arg3: T3, callback: (err: NodeJS.ErrnoException) => void) => void;
    protected callbackifyBound<T1, T2, T3, TResult>(
        fn: (arg1: T1, arg2: T2, arg3: T3) => Promise<TResult>
    ): (arg1: T1, arg2: T2, arg3: T3, callback: (err: NodeJS.ErrnoException | null, result: TResult) => void) => void;
    protected callbackifyBound<T1, T2, T3, T4>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<void>
    ): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (err: NodeJS.ErrnoException) => void) => void;
    protected callbackifyBound<T1, T2, T3, T4, TResult>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<TResult>
    ): (
        arg1: T1,
        arg2: T2,
        arg3: T3,
        arg4: T4,
        callback: (err: NodeJS.ErrnoException | null, result: TResult) => void
    ) => void;
    protected callbackifyBound<T1, T2, T3, T4, T5>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<void>
    ): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, callback: (err: NodeJS.ErrnoException) => void) => void;
    protected callbackifyBound<T1, T2, T3, T4, T5, TResult>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<TResult>
    ): (
        arg1: T1,
        arg2: T2,
        arg3: T3,
        arg4: T4,
        arg5: T5,
        callback: (err: NodeJS.ErrnoException | null, result: TResult) => void
    ) => void;
    protected callbackifyBound<T1, T2, T3, T4, T5, T6>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6) => Promise<void>
    ): (
        arg1: T1,
        arg2: T2,
        arg3: T3,
        arg4: T4,
        arg5: T5,
        arg6: T6,
        callback: (err: NodeJS.ErrnoException) => void
    ) => void;
    protected callbackifyBound<T1, T2, T3, T4, T5, T6, TResult>(
        fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6) => Promise<TResult>
    ): (
        arg1: T1,
        arg2: T2,
        arg3: T3,
        arg4: T4,
        arg5: T5,
        arg6: T6,
        callback: (err: NodeJS.ErrnoException | null, result: TResult) => void
    ) => void;

    protected callbackifyBound<T1, T2, T3, T4, T5, T6, TResult>(
        fn: (arg1?: T1, arg2?: T2, arg3?: T3, arg4?: T4, arg5?: T5, arg6?: T6) => Promise<TResult>
    ): (
        arg1?: T1 | ClientMethodCallback<TResult>,
        arg2?: T2 | ClientMethodCallback<TResult>,
        arg3?: T3 | ClientMethodCallback<TResult>,
        arg4?: T4 | ClientMethodCallback<TResult>,
        arg5?: T5 | ClientMethodCallback<TResult>,
        arg6?: T6 | ClientMethodCallback<TResult>,
        callback?: ClientMethodCallback<TResult>
    ) => void {
        function safeFn(...args): Promise<TResult> {
            try {
                return fn.call(this, ...args);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return callbackify(safeFn).bind(this);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
    // this is the type returned from all requests via generated methods
    _response: msRest.HttpResponse & {
        bodyAsText: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parsedBody: any;
    };
}
