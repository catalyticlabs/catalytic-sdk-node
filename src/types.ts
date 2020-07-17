import { HttpResponse } from '@azure/ms-rest-js';
import { AccessToken } from './entities';

export interface FieldInput {
    /**
     * @summary The name or referenceName of the Field on the Instance
     */
    name: string;
    /**
     * @summary The string-serialized value of the Field
     */
    value: string;
}

export interface BaseFindOptions {
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
    _response: HttpResponse & {
        bodyAsText: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parsedBody: any;
    };
}

export interface AccessTokenProvider {
    accessToken: AccessToken;
}

export interface LoggerProvider {
    logger: Logger;
}

export interface Logger {
    debug: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
}
