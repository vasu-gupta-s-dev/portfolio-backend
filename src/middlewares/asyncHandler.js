/**
 * Async Handler Utility
 * Wraps async route handlers to catch errors and pass them to error middleware
 */

/**
 * Wraps an async function to catch errors
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncHandler;
