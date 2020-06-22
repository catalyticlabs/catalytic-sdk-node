import { expect } from 'chai';

import { UserAgent, Version } from '../src/constants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json');

describe('Constants', function() {
    describe('Version', function() {
        it('should match current NPM package version', function() {
            expect(Version).to.equal(version);
        });
    });
    describe('UserAgent', function() {
        it('should include current NPM package version', function() {
            expect(UserAgent).to.include(`/${version}`);
        });
    });
});
