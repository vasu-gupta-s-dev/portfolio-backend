/**
 * Health Controller
 * Handles health check endpoints
 */

import prisma from '../prisma/client.js';
import asyncHandler from '../middlewares/asyncHandler.js';

/**
 * Health check endpoint
 * GET /api/health
 */
export const healthCheck = asyncHandler(async (req, res) => {
    // Check database connectivity
    let dbStatus = 'connected';
    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
        dbStatus = 'disconnected';
    }

    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbStatus,
        environment: process.env.NODE_ENV || 'development'
    });
});

export default {
    healthCheck
};
