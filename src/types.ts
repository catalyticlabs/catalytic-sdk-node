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

export interface ReferenceableFieldInput extends FieldInput {
    referenceName: string;
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

export interface BaseSearchOptions {
    /**
     * Free text query terms to search for
     */
    query?: UserSearchClause;
    /**
     * The token representing the result page to get
     */
    pageToken?: string;
    /**
     * The page size requested
     */
    pageSize?: number;
}

export interface UserSearchClause {
    and?: UserSearchClause[];
    or?: UserSearchClause[];
    id?: GuidSearchExpression;
    email?: StringSearchExpression;
    fullName?: StringSearchExpression;
    isTeamAdmin?: BooleanSearchExpression;
    isDeactivated?: BooleanSearchExpression;
    isLockedOut?: BooleanSearchExpression;
    createdDate?: DateTimeSearchExpression;
}

export interface BooleanSearchExpression {
    isEqualTo?: boolean;
    contains?: boolean;
}

export interface StringSearchExpression {
    isEqualTo?: string;
    between?: StringRange;
    contains?: string;
}

export interface StringRange {
    lowerBoundInclusive: string;
    upperBoundInclusive?: string;
}

export interface GuidSearchExpression {
    isEqualTo?: string;
}

export interface DateTimeSearchExpression {
    isEqualTo?: Date;
    between?: DateTimeRange;
    contains?: Date;
}

export interface DateTimeRange {
    lowerBoundInclusive: Date;
    upperBoundInclusive?: Date;
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

export enum ResponseType {
    BLOB = 'blob',
    STREAM = 'stream'
}
