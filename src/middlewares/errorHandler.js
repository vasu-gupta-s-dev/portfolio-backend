/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

import env from '../config/env.js';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Not Found Handler
 * Catches requests to undefined routes
 */
export const notFoundHandler = (req, res, next) => {
    const error = new ApiError(404, `Cannot ${req.method} ${req.originalUrl}`);
    next(error);
};

/**
 * Global Error Handler
 * Processes all errors and sends appropriate response
 */
export const errorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let status = err.status || 'error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        status = 'fail';
    }

    if (err.code === 'P2002') {
        // Prisma unique constraint violation
        statusCode = 409;
        message = 'A record with this value already exists';
        status = 'fail';
    }

    if (err.code === 'P2025') {
        // Prisma record not found
        statusCode = 404;
        message = 'Record not found';
        status = 'fail';
    }

    // Log error in development
    if (env.isDevelopment()) {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            statusCode
        });
    }

    // Send response
    res.status(statusCode).json({
        status,
        message,
        ...(env.isDevelopment() && { stack: err.stack })
    });
};

export default {
    ApiError,
    notFoundHandler,
    errorHandler
};
