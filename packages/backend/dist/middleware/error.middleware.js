"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.asyncErrorHandler = void 0;
const asyncErrorHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncErrorHandler = asyncErrorHandler;
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    let statusCode = 500;
    let message = 'Internal server error';
    if (error.code === '23505') {
        statusCode = 409;
        message = 'Duplicate entry';
    }
    else if (error.name === 'EntityNotFound') {
        statusCode = 404;
        message = 'Resource not found';
    }
    if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = error.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map