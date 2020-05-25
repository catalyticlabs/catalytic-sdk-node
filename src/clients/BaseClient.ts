import * as msRest from '@azure/ms-rest-js';

import { CatalyticSDKAPI } from '../internal/lib/catalyticSDKAPI';
import { CredentialsProvider } from '../entities/Credentials';
import InternalError from '../errors/InternalError';
import InvalidCredentialsError from '../errors/InvalidCredentialsError';
import ResourceNotFoundError from '../errors/ResourceNotFoundError';
import UnauthorizedError from '../errors/UnauthorizedError';

type InternalAPIResponse = {
    body: any;
    // this is the type returned from all requests via generated methods
    _response: msRest.HttpResponse & {
        bodyAsText: string;
        parsedBody: any;
    };
};

export default class BaseClient {
    public internalClient: CatalyticSDKAPI;
    public credentialsProvider: CredentialsProvider;

    constructor(internalClient: CatalyticSDKAPI, credentialsProvider: CredentialsProvider) {
        this.internalClient = internalClient;
        this.credentialsProvider = credentialsProvider;
    }

    getRequestHeaders(): { [headerName: string]: string } {
        const credentials = this.credentialsProvider.credentials;
        if (!credentials) {
            throw new InvalidCredentialsError('No Credentials provided');
        }
        return {
            Authorization: `Bearer ${credentials.token}`
        };
    }

    parseResponse<T>(response: InternalAPIResponse): T {
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
            detail = problemDetails.detail || problemDetails.Detail || response._response.bodyAsText;
        } catch (e) {
            detail = response._response.bodyAsText;
        }
        this.throwError(detail, response._response.status);
    }

    private throwError(message: string, status: number, entity?: string): void {
        switch (status) {
            case 401:
                throw new UnauthorizedError(message);
            case 404:
                throw new ResourceNotFoundError(message, entity);
            default:
                throw new InternalError(message);
        }
    }
}
