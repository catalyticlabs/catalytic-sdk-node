import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { createWriteStream } from 'fs';
import { Stream } from 'stream';
import toVFile from 'to-vfile';
import { callbackify } from 'util';
import vfile from 'vfile';

import { CatalyticSDKAPI } from '../internal/lib/catalyticSDKAPI';
import {
    InvalidAccessTokenError,
    UnauthorizedError,
    ResourceNotFoundError,
    InternalError,
    isAxiosError
} from '../errors';
import { BaseUri, UserAgent } from '../constants';
import { FileDescriptor } from '../entities';
import { ClientMethodCallback, AccessTokenProvider, InternalAPIResponse, LoggerProvider, ResponseType } from '../types';

export default abstract class BaseClient {
    static entity: string;

    protected _internalClient: CatalyticSDKAPI;
    protected _accessTokenProvider: AccessTokenProvider;
    protected _loggerProvider: LoggerProvider;

    constructor(
        internalClient: CatalyticSDKAPI,
        accessTokenProvider: AccessTokenProvider,
        loggerProvider: LoggerProvider
    ) {
        this._internalClient = internalClient;
        this._accessTokenProvider = accessTokenProvider;
        this._loggerProvider = loggerProvider;
    }

    protected log(message: string): void {
        if (this._loggerProvider.logger) {
            this._loggerProvider.logger.info(message);
        }
    }

    protected getRequestHeaders(): { [headerName: string]: string } {
        const accessToken = this._accessTokenProvider.accessToken;
        if (!accessToken) {
            throw new InvalidAccessTokenError('No Access Token provided');
        }
        return {
            Authorization: `Bearer ${accessToken.token}`
        };
    }

    protected async uploadVirtualFile<T>(files: FileDescriptor[], endpoint = 'files:upload'): Promise<T> {
        const url = `${BaseUri}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

        const headers = this.getRequestHeaders();

        const form = files.reduce((form, f) => {
            const file = vfile(f);
            form.append('files', file.contents, file.basename);
            return form;
        }, new FormData());

        const formHeaders = form.getHeaders ? form.getHeaders() : {};

        try {
            const result = await axios.post(url, form, {
                headers: { ...headers, ...formHeaders, 'User-Agent': UserAgent }
            });
            return result.data;
        } catch (err) {
            const status = err.response?.status;
            const data = err.response?.data;
            const message = data?.Detail || data?.detail || data || 'Failed to upload file';
            this.throwError(message, status);
        }
    }

    protected async uploadFile<T>(files: FileDescriptor | FileDescriptor[], endpoint = 'files:upload'): Promise<T> {
        const fileArgs = !Array.isArray(files) ? [files] : files;
        const vfiles = await Promise.all(
            fileArgs.map(async file => (typeof file === 'string' ? toVFile.read(file) : file))
        );
        return this.uploadVirtualFile<T>(vfiles, endpoint);
    }

    protected async getFileDownload<T = Stream>(endpoint: string, responseType: ResponseType): Promise<T> {
        const url = `${BaseUri}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        const headers = { ...this.getRequestHeaders(), 'User-Agent': UserAgent };

        try {
            const response: AxiosResponse<T> = await axios.get(url, {
                responseType,
                headers
            });

            return response.data;
        } catch (err) {
            let status = 500;
            let message = err.toString();

            if (!isAxiosError<T>(err)) {
                this.throwError(message, status);
            }

            status = err.response?.status || status;
            const raw = err.response?.data;

            if (raw instanceof Stream) {
                const stream = raw;
                const chunks = [];
                await new Promise((resolve, reject) => {
                    stream.on('data', (chunk: any) => chunks.push(chunk));
                    stream.on('error', reject);
                    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
                });
                message = chunks.join('');
            } else {
                message = raw as any;
            }

            try {
                const data = JSON.parse(message);
                message = data.detail || data.Detail;
            } catch (e) {}

            this.throwError(message || 'Failed to get download stream', status);
        }
    }

    protected async getFileDownloadBlob(endpoint: string): Promise<Blob> {
        return this.getFileDownload<Blob>(endpoint, ResponseType.BLOB);
    }

    protected async getFileDownloadStream(endpoint: string): Promise<Stream> {
        return this.getFileDownload<Stream>(endpoint, ResponseType.STREAM);
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

    protected parseResponse<T>(response: InternalAPIResponse, entity?: string): T {
        if (response._response.status >= 400) {
            this.handleError(response, entity);
        }
        return response._response.parsedBody as T;
    }

    private handleError(response: InternalAPIResponse, entity?: string): never {
        let detail = '';
        try {
            // ProblemDetails responses can come back with Pascal cased JSON, so casting may drop properties
            const problemDetails = JSON.parse(response._response.bodyAsText);
            // clean this up after https://github.com/catalyticlabs/catalytic-sdk-node/issues/3 is closed
            detail = problemDetails.detail || problemDetails.Detail;
        } catch (e) {}
        this.throwError(detail || response._response.bodyAsText, response._response.status, entity);
    }

    private throwError(message: string, status: number, entity?: string): never {
        switch (status) {
            case 401:
                throw new UnauthorizedError(message);
            case 404:
                throw new ResourceNotFoundError(message, entity || this.constructor['entity']);
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
