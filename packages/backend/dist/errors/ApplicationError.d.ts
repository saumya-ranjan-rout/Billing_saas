export declare class ApplicationError extends Error {
    readonly statusCode: number;
    readonly details?: any;
    constructor(message: string, statusCode?: number, details?: any);
}
export declare class ValidationError extends ApplicationError {
    constructor(message: string, details?: any);
}
export declare class BadRequestError extends ApplicationError {
    constructor(message?: string, details?: any);
}
export declare class AuthenticationError extends ApplicationError {
    constructor(message?: string);
}
export declare class AuthorizationError extends ApplicationError {
    constructor(message?: string);
}
export declare class NotFoundError extends ApplicationError {
    constructor(resource?: string);
}
export declare class ConflictError extends ApplicationError {
    constructor(message?: string);
}
//# sourceMappingURL=ApplicationError.d.ts.map