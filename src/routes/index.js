/**
 * Main Router
 * Combines all route modules
 */

import { Router } from 'express';
import projectRoutes from './projectRoutes.js';
import contactRoutes from './contactRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

/**
 * Mount route modules
 */
router.use('/projects', projectRoutes);
router.use('/contact', contactRoutes);
router.use('/health', healthRoutes);

export default router;
