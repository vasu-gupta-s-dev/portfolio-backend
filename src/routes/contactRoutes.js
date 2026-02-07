/**
 * Contact Routes
 * API routes for contact form endpoints
 */

import { Router } from 'express';
import * as contactController from '../controllers/contactController.js';
import { contactValidationRules, validate } from '../validations/contactValidation.js';

const router = Router();

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 * @body    name, email, message
 */
router.post('/', contactValidationRules, validate, contactController.submitContact);

export default router;
