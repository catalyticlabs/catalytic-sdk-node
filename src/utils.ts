import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync, mkdirSync } from 'fs';
// eslint-disable-next-line import/default
import open from 'open';

import { InvalidTeamNameError, FieldInputError } from './errors';
import { FieldInput } from './types';
import { Field } from './entities';

/**
 * Find a matching field for an input field value
 *
 * @param input The FieldInput for which a matching field should be identified
 * @param sourceFields The set of source Fields from which the matching field should be identified
 * @returns The matching field
 */
export function findMatchingField(input: FieldInput, sourceFields: Field[]): Field {
    const matchingField = sourceFields.find(
        field =>
            field.name === input.name ||
            displayNameToInternal(field.referenceName) === displayNameToInternal(input.name) ||
            displayNameToInternal(field.name) === displayNameToInternal(input.name)
    );

    if (!matchingField) {
        throw new FieldInputError(`No corresponding input field found with name '${input.name}'`);
    }

    return matchingField;
}

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

const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export function isUUID(value: string): boolean {
    return UUID_REGEX.test(value.trim().toLowerCase());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapNative<T extends Function>(fn: T, defaultReturn: any = undefined): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function(...args: any[]) {
        return !!fn ? fn(...args) : defaultReturn;
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Native wrappers Node FS functions for browser environments
export const exists = wrapNative(existsSync, false);
export const mkdir = wrapNative(mkdirSync);
export const readFile = wrapNative(readFileSync, '');
export const readdir = wrapNative(readdirSync, []);
export const unlink = wrapNative(unlinkSync);
export const writeFile = wrapNative(writeFileSync);
