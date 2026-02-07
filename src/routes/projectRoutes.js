/**
 * Project Routes
 * API routes for project-related endpoints
 */

import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';

const router = Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Public
 * @query   featured - Filter for featured projects only (optional)
 */
router.get('/', projectController.getProjects);

/**
 * @route   GET /api/projects/:id
 * @desc    Get a single project by ID
 * @access  Public
 */
router.get('/:id', projectController.getProject);

export default router;
