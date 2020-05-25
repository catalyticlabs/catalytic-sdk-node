import nock from 'nock';

export default function createMockApi(): nock.Scope {
    return nock('https://sdk.catalytic.com/v1.0.1-pre-33');
}
