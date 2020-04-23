export default class InvalidCredentialsError extends Error {
    constructor(message: string) {
        super(message);
    }
}
