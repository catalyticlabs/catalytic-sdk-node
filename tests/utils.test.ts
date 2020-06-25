import { displayNameToInternal, validateTeamName, getDomainFromTeamName } from '../src/utils';
import { expect } from 'chai';
import { InvalidTeamNameError } from '../src/errors';

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

    describe('validateTeamName', function() {
        it('should validate teamNames', function() {
            const goodTeamNames = ['my-team', 'MYTEAM', 'MY_TEAM', 'myteam123', '1myTeam'];
            goodTeamNames.forEach(t => expect(() => validateTeamName(t), t).to.not.throw());

            const badTeamNames = ['-myteam', 'my team', 'my@team'];

            badTeamNames.forEach(t => expect(() => validateTeamName(t), t).to.throw(InvalidTeamNameError));

            expect(() => validateTeamName('MYTEAM')).to.not.throw();
            expect(() => validateTeamName('MY_TEAM')).to.not.throw();
            expect(() => validateTeamName('myteam123')).to.not.throw();
            expect(() => validateTeamName('1myTeam')).to.not.throw();

            expect(() => validateTeamName('1myTeam')).to.not.throw();
        });
    });

    describe('getDomainFromTeamName', function() {
        it('should probably get domain from user provided input', function() {
            const cases = [
                ['https://catalytic.pushbot.com/test', 'catalytic.pushbot.com'],
                ['https://catalytic.pushbot.com/', 'catalytic.pushbot.com'],
                ['catalytic.pushbot.com/test', 'catalytic.pushbot.com'],
                ['catalytic.pushbot.com/', 'catalytic.pushbot.com'],
                ['catalytic.pushbot.com', 'catalytic.pushbot.com'],
                ['https://catalytic-pc-test.pushbot.com/test', 'catalytic-pc-test.pushbot.com'],
                ['https://catalytic-pc-test.pushbot.com/', 'catalytic-pc-test.pushbot.com'],
                ['catalytic-pc-test.pushbot.com/test', 'catalytic-pc-test.pushbot.com'],
                ['catalytic-pc-test.pushbot.com/', 'catalytic-pc-test.pushbot.com'],
                ['catalytic-pc-test.pushbot.com', 'catalytic-pc-test.pushbot.com'],
                ['https://qa.lime.pushbot.io/test', 'qa.lime.pushbot.io'],
                ['https://qa.lime.pushbot.io/', 'qa.lime.pushbot.io'],
                ['qa.lime.pushbot.io/test', 'qa.lime.pushbot.io'],
                ['qa.lime.pushbot.io/', 'qa.lime.pushbot.io'],
                ['qa.lime.pushbot.io', 'qa.lime.pushbot.io'],
                ['https://Catalytic.pushbot.com/test', 'catalytic.pushbot.com'],
                ['https://Catalytic.pushbot.com/', 'catalytic.pushbot.com'],
                ['Catalytic.pushbot.com/test', 'catalytic.pushbot.com'],
                ['Catalytic.pushbot.com/', 'catalytic.pushbot.com'],
                ['Catalytic.pushbot.com', 'catalytic.pushbot.com'],
                ['https://Catalytic-PC-test.pushbot.com/test', 'catalytic-pc-test.pushbot.com'],
                ['https://Catalytic-PC-test.pushbot.com/', 'catalytic-pc-test.pushbot.com'],
                ['Catalytic-PC-test.pushbot.com/test', 'catalytic-pc-test.pushbot.com'],
                ['Catalytic-PC-test.pushbot.com/', 'catalytic-pc-test.pushbot.com'],
                ['Catalytic-PC-test.pushbot.com', 'catalytic-pc-test.pushbot.com'],
                ['https://QA.lime.pushbot.io/test', 'qa.lime.pushbot.io'],
                ['https://QA.lime.pushbot.io/', 'qa.lime.pushbot.io'],
                ['QA.lime.pushbot.io/test', 'qa.lime.pushbot.io'],
                ['QA.lime.pushbot.io/', 'qa.lime.pushbot.io'],
                ['QA.lime.pushbot.io', 'qa.lime.pushbot.io'],

                ['MyTeam', 'myteam.pushbot.com'],
                ['myteam', 'myteam.pushbot.com'],
                ['my-team', 'my-team.pushbot.com'],
                ['my-team-', 'my-team-.pushbot.com']
            ];

            cases.forEach(([input, expected]) => expect(getDomainFromTeamName(input), input).to.equal(expected));
        });

        it('should throw error for invalid input', function() {
            const cases = [
                'https://my team.pushbot.com',
                'my team.pushbot.com',
                'my+team.pushbot.com',
                '-myteam.pushbot.com',
                'my team',
                '-myteam',
                'my+team'
            ];
            cases.forEach(input => expect(() => getDomainFromTeamName(input), input).to.throw(InvalidTeamNameError));
        });
    });
});
