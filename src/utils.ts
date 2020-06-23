import open = require('open');

import { InvalidTeamNameError } from './errors';

export function displayNameToInternal(name: string): string {
    if (!name) {
        return name;
    }
    return name
        .trim()
        .toLowerCase()
        .replace(/\W*-{2,}\W*/g, '--')
        .replace(/(?!--)(\W+)/g, '-')
        .replace(/^-+/g, '');
}

const PROTOCOL_REGEX = /^https?:\/\//i;
const DOMAIN_HOSTNAME_REGEX = /([a-z0-9][a-z0-9-_]+\.)+(io|com)/i;
const VALID_TEAMNAME_REGEX = /^[a-z0-9][a-z0-9-_]+$/i;

export function validateTeamName(teamName: string): void {
    if (VALID_TEAMNAME_REGEX.test(teamName)) {
        return;
    }
    throw new InvalidTeamNameError(teamName);
}

export function getDomainFromTeamName(teamNameOrDomain: string): string {
    teamNameOrDomain = teamNameOrDomain.trim().replace(PROTOCOL_REGEX, '');
    if (DOMAIN_HOSTNAME_REGEX.test(teamNameOrDomain)) {
        validateTeamName(teamNameOrDomain.split('.')[0]);
        return teamNameOrDomain.match(DOMAIN_HOSTNAME_REGEX)[0].toLowerCase();
    }
    validateTeamName(teamNameOrDomain);
    return `${teamNameOrDomain.toLowerCase()}.pushbot.com`;
}

export function openUrl(url: string): void {
    open(url);
}
