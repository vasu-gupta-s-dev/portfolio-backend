/**
 * Contact Form Validation
 * Express-validator rules for contact form submission
 */

import { body, validationResult } from 'express-validator';
import { ApiError } from '../middlewares/errorHandler.js';

/**
 * Validation rules for contact form
 */
export const contactValidationRules = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .escape(),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email must not exceed 255 characters'),

    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 10, max: 5000 })
        .withMessage('Message must be between 10 and 5000 characters')
];

/**
 * Validation result handler middleware
 * Checks for validation errors and throws ApiError if any
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));

        return res.status(400).json({
            status: 'fail',
            message: 'Validation failed',
            errors: errorMessages
        });
    }

    next();
};

export default {
    contactValidationRules,
    validate
};
