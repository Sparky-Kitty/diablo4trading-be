export enum COMMON_ERROR_CODES {
    BAD_REQUEST = 'BAD_REQUEST',
    NOT_FOUND = 'NOT_FOUND',
}

export class ServiceResponseException extends Error {
    code: any;

    constructor(code: any, message: string) {
        super(message);
        Object.setPrototypeOf(this, ServiceResponseException.prototype);
        this.name = this.constructor.name;
        this.message = message;
        this.code = code;
    }
}
