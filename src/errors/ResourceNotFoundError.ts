export default class ResourceNotFoundError extends Error {
    constructor(message: string, entity?: string) {
        if (!entity) {
            super(message);
        } else {
            super(`${entity} not found: ${message}`);
        }

        // See https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
    }
}
