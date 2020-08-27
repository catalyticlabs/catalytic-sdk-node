import { expect } from 'chai';
import { isAxiosError } from '../../src/errors/utils';
import { AxiosError } from 'axios';

describe('Errors', function() {
    describe('isAxiosError', function() {
        it('should return true if Error is an AxiosError', function() {
            const err = new Error('Oh noes!');
            (err as AxiosError).isAxiosError = true;
            expect(isAxiosError(err)).to.be.true;
        });
        it('should return false if Error is not an AxiosError', function() {
            const err = new Error('Oh noes!');
            expect(isAxiosError(err)).to.be.false;
        });
    });
});
