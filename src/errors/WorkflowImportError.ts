export default class WorkflowImportError extends Error {
    constructor(message: string) {
        super(message);

        // See https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, WorkflowImportError.prototype);
    }
}
