/**
 * API Response Utility
 * Standardized response formatting helpers
 */

/**
 * Format a success response
 * @param {Object} data - Response data
 * @param {string} message - Optional message
 * @returns {Object} Formatted response object
 */
export const successResponse = (data, message = null) => {
    const response = {
        status: 'success',
        ...data
    };

    if (message) {
        response.message = message;
    }

    return response;
};

/**
 * Format an error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted error object
 */
export const errorResponse = (message, statusCode = 500) => {
    return {
        status: statusCode >= 400 && statusCode < 500 ? 'fail' : 'error',
        message
    };
};

export default {
    successResponse,
    errorResponse
};
