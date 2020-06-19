import nock from 'nock';

import { BaseUri } from '../src/constants';

export default function createMockApi(): nock.Scope {
    return nock(BaseUri);
}
