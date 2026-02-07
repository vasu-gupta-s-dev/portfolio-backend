/**
 * Health Routes
 * API routes for health check endpoint
 */

import { Router } from 'express';
import * as healthController from '../controllers/healthController.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', healthController.healthCheck);

export default router;
