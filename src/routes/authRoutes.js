/**
 * Auth Routes
 * Handles admin authentication endpoints
 */

import { Router } from 'express';
import authService from '../services/authService.js';

const router = Router();

/**
 * POST /api/auth/login
 * Login admin user
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username and password are required'
            });
        }

        const result = await authService.loginAdmin(username, password);

        if (!result.success) {
            return res.status(401).json({
                status: 'error',
                message: result.error
            });
        }

        res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                token: result.token,
                admin: result.admin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during login'
        });
    }
});

/**
 * POST /api/auth/setup
 * Create initial admin account (only works if no admins exist)
 */
router.post('/setup', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username and password are required'
            });
        }

        // Check if any admin already exists
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        const existingAdmin = await prisma.admin.findFirst();

        if (existingAdmin) {
            return res.status(403).json({
                status: 'error',
                message: 'Admin already exists. Setup not allowed.'
            });
        }

        const admin = await authService.createAdmin(username, password, email);

        res.status(201).json({
            status: 'success',
            message: 'Admin created successfully',
            data: { admin }
        });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during setup'
        });
    }
});

/**
 * GET /api/auth/me
 * Get current admin info (requires authentication)
 */
router.get('/me', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Access token required'
        });
    }

    const decoded = authService.verifyToken(token);

    if (!decoded) {
        return res.status(403).json({
            status: 'error',
            message: 'Invalid or expired token'
        });
    }

    const admin = await authService.getAdminById(decoded.id);

    if (!admin) {
        return res.status(404).json({
            status: 'error',
            message: 'Admin not found'
        });
    }

    res.json({
        status: 'success',
        data: { admin }
    });
});

export default router;
