import sinon from 'sinon';

import BaseClient, { InternalAPIResponse } from '../../src/clients/BaseClient';

export const createResponse = (body: any, status = 200): InternalAPIResponse => {
    return {
        body,
        _response: {
            status,
            parsedBody: body,
            bodyAsText: JSON.stringify(body),
            request: null,
            headers: null
        }
    };
};

export const executeTest = async function(
    client: BaseClient,
    method: string,
    args: Array<any>,
    assert: (err?: Error, result?: any) => void
): Promise<void> {
    let error;
    let result;

    try {
        result = await client[method].call(client, ...args);
    } catch (e) {
        error = e;
    }

    assert(error, result);

    sinon.resetHistory();

    client[method].call(client, ...args, assert);
};
