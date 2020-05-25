export default class ResourceNotFoundError extends Error {
    constructor(message: string, entity?: string) {
        if (!entity) {
            super(message);
        }

        super(`${entity} not found: ${message}`);
    }
}
