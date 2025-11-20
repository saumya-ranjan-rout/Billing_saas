"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.BadRequestError = exports.ValidationError = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    constructor(message, statusCode = 500, details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApplicationError = ApplicationError;
class ValidationError extends ApplicationError {
    constructor(message, details) {
        super(message, 400, details);
    }
}
exports.ValidationError = ValidationError;
class BadRequestError extends ApplicationError {
    constructor(message = 'Bad Request', details) {
        super(message, 400, details);
    }
}
exports.BadRequestError = BadRequestError;
class AuthenticationError extends ApplicationError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends ApplicationError {
    constructor(message = 'Access denied') {
        super(message, 403);
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends ApplicationError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends ApplicationError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=ApplicationError.js.map