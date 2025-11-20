"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noContent = exports.keysetPaginated = exports.paginated = exports.tooManyRequests = exports.conflict = exports.badRequest = exports.forbidden = exports.unauthorized = exports.notFound = exports.validationError = exports.errorResponse = exports.created = exports.ok = void 0;
const logger_1 = __importDefault(require("./logger"));
const ok = (res, data, message, pagination) => {
    const response = {
        success: true,
        data,
        message,
        pagination,
        timestamp: new Date().toISOString(),
    };
    logger_1.default.debug('API Success Response', {
        url: res.req?.url,
        method: res.req?.method,
        statusCode: 200,
        message,
    });
    return res.status(200).json(response);
};
exports.ok = ok;
const created = (res, data, message = 'Resource created successfully') => {
    const response = {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    };
    logger_1.default.debug('API Created Response', {
        url: res.req?.url,
        method: res.req?.method,
        statusCode: 201,
        message,
    });
    return res.status(201).json(response);
};
exports.created = created;
const errorResponse = (res, message, statusCode = 500, code, details) => {
    const errorCode = code || getDefaultErrorCode(statusCode);
    const response = {
        success: false,
        error: {
            code: errorCode,
            message,
            details,
        },
        timestamp: new Date().toISOString(),
    };
    if (statusCode >= 500) {
        logger_1.default.error('API Error Response', {
            url: res.req?.url,
            method: res.req?.method,
            statusCode,
            errorCode,
            message,
            details,
        });
    }
    else {
        logger_1.default.warn('API Client Error Response', {
            url: res.req?.url,
            method: res.req?.method,
            statusCode,
            errorCode,
            message,
            details,
        });
    }
    return res.status(statusCode).json(response);
};
exports.errorResponse = errorResponse;
const validationError = (res, errors, message = 'Validation failed') => {
    return (0, exports.errorResponse)(res, message, 422, 'VALIDATION_ERROR', errors);
};
exports.validationError = validationError;
const notFound = (res, message = 'Resource not found') => {
    return (0, exports.errorResponse)(res, message, 404, 'NOT_FOUND');
};
exports.notFound = notFound;
const unauthorized = (res, message = 'Unauthorized access') => {
    return (0, exports.errorResponse)(res, message, 401, 'UNAUTHORIZED');
};
exports.unauthorized = unauthorized;
const forbidden = (res, message = 'Access forbidden') => {
    return (0, exports.errorResponse)(res, message, 403, 'FORBIDDEN');
};
exports.forbidden = forbidden;
const badRequest = (res, message = 'Bad request', details) => {
    return (0, exports.errorResponse)(res, message, 400, 'BAD_REQUEST', details);
};
exports.badRequest = badRequest;
const conflict = (res, message = 'Resource conflict', details) => {
    return (0, exports.errorResponse)(res, message, 409, 'CONFLICT', details);
};
exports.conflict = conflict;
const tooManyRequests = (res, message = 'Too many requests', retryAfter) => {
    if (retryAfter) {
        res.setHeader('Retry-After', retryAfter.toString());
    }
    return (0, exports.errorResponse)(res, message, 429, 'RATE_LIMIT_EXCEEDED', { retryAfter });
};
exports.tooManyRequests = tooManyRequests;
const getDefaultErrorCode = (statusCode) => {
    const errorCodes = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        409: 'CONFLICT',
        422: 'VALIDATION_ERROR',
        429: 'RATE_LIMIT_EXCEEDED',
        500: 'INTERNAL_SERVER_ERROR',
        502: 'BAD_GATEWAY',
        503: 'SERVICE_UNAVAILABLE',
        504: 'GATEWAY_TIMEOUT',
    };
    return errorCodes[statusCode] || 'INTERNAL_SERVER_ERROR';
};
const paginated = (res, data, pagination, message) => {
    return (0, exports.ok)(res, data, message, pagination);
};
exports.paginated = paginated;
const keysetPaginated = (res, data, pagination, message) => {
    return (0, exports.ok)(res, data, message, pagination);
};
exports.keysetPaginated = keysetPaginated;
const noContent = (res) => {
    logger_1.default.debug('API No Content Response', {
        url: res.req?.url,
        method: res.req?.method,
        statusCode: 204,
    });
    return res.status(204).send();
};
exports.noContent = noContent;
exports.default = {
    ok: exports.ok,
    created: exports.created,
    errorResponse: exports.errorResponse,
    validationError: exports.validationError,
    notFound: exports.notFound,
    unauthorized: exports.unauthorized,
    forbidden: exports.forbidden,
    badRequest: exports.badRequest,
    conflict: exports.conflict,
    tooManyRequests: exports.tooManyRequests,
    paginated: exports.paginated,
    keysetPaginated: exports.keysetPaginated,
    noContent: exports.noContent,
};
//# sourceMappingURL=response.js.map