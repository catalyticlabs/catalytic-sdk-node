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
