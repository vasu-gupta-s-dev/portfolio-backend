/**
 * Main Router
 * Combines all route modules
 */

import { Router } from 'express';
import projectRoutes from './projectRoutes.js';
import contactRoutes from './contactRoutes.js';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

/**
 * Mount route modules
 */
// Public routes
router.use('/projects', projectRoutes);
router.use('/contact', contactRoutes);
router.use('/health', healthRoutes);

// Auth routes
router.use('/auth', authRoutes);

// Protected admin routes
router.use('/admin', adminRoutes);

export default router;
