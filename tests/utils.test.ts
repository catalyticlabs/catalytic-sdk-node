import { displayNameToInternal } from '../src/utils';
import { expect } from 'chai';

describe('Utils', function() {
    describe('displayNameToInternal', function() {
        it('should convert a display name to an internal name', function() {
            expect(displayNameToInternal('Test Field Name')).to.equal('test-field-name');
            expect(displayNameToInternal('    my-field')).to.equal('my-field');
            expect(displayNameToInternal('my-field     ')).to.equal('my-field');
            expect(displayNameToInternal('@something@')).to.equal('something-');
            expect(displayNameToInternal('')).to.equal('');
            expect(displayNameToInternal(null)).to.equal(null);
        });
    });
});
