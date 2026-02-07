/**
 * Admin Routes
 * Protected routes for managing projects and messages
 */

import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import prisma from '../config/prisma.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// ============================================================================
// Projects Management
// ============================================================================

/**
 * GET /api/admin/projects
 * Get all projects (including non-featured)
 */
router.get('/projects', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
        });

        res.json({
            status: 'success',
            data: { projects }
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch projects'
        });
    }
});

/**
 * POST /api/admin/projects
 * Create new project
 */
router.post('/projects', async (req, res) => {
    try {
        const { title, description, techStack, githubUrl, liveUrl, featured, sortOrder } = req.body;

        if (!title || !description || !techStack) {
            return res.status(400).json({
                status: 'error',
                message: 'Title, description, and techStack are required'
            });
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                techStack,
                githubUrl: githubUrl || null,
                liveUrl: liveUrl || null,
                featured: featured || false,
                sortOrder: sortOrder || 0
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'Project created',
            data: { project }
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create project'
        });
    }
});

/**
 * PUT /api/admin/projects/:id
 * Update project
 */
router.put('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, techStack, githubUrl, liveUrl, featured, sortOrder } = req.body;

        const project = await prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                techStack,
                githubUrl,
                liveUrl,
                featured,
                sortOrder
            }
        });

        res.json({
            status: 'success',
            message: 'Project updated',
            data: { project }
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update project'
        });
    }
});

/**
 * DELETE /api/admin/projects/:id
 * Delete project
 */
router.delete('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.project.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            status: 'success',
            message: 'Project deleted'
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete project'
        });
    }
});

// ============================================================================
// Messages Management
// ============================================================================

/**
 * GET /api/admin/messages
 * Get all contact messages
 */
router.get('/messages', async (req, res) => {
    try {
        const { unread } = req.query;

        const where = unread === 'true' ? { isRead: false } : {};

        const messages = await prisma.contactMessage.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            status: 'success',
            data: { messages }
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch messages'
        });
    }
});

/**
 * GET /api/admin/messages/stats
 * Get message statistics
 */
router.get('/messages/stats', async (req, res) => {
    try {
        const [total, unread] = await Promise.all([
            prisma.contactMessage.count(),
            prisma.contactMessage.count({ where: { isRead: false } })
        ]);

        res.json({
            status: 'success',
            data: { total, unread, read: total - unread }
        });
    } catch (error) {
        console.error('Error fetching message stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch message statistics'
        });
    }
});

/**
 * PUT /api/admin/messages/:id/read
 * Mark message as read
 */
router.put('/messages/:id/read', async (req, res) => {
    try {
        const { id } = req.params;

        const message = await prisma.contactMessage.update({
            where: { id: parseInt(id) },
            data: { isRead: true }
        });

        res.json({
            status: 'success',
            message: 'Message marked as read',
            data: { message }
        });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update message'
        });
    }
});

/**
 * DELETE /api/admin/messages/:id
 * Delete message
 */
router.delete('/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.contactMessage.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            status: 'success',
            message: 'Message deleted'
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete message'
        });
    }
});

// ============================================================================
// Dashboard Stats
// ============================================================================

/**
 * GET /api/admin/dashboard/stats
 * Get dashboard overview statistics
 */
router.get('/dashboard/stats', async (req, res) => {
    try {
        const [projectCount, messageCount, unreadCount] = await Promise.all([
            prisma.project.count(),
            prisma.contactMessage.count(),
            prisma.contactMessage.count({ where: { isRead: false } })
        ]);

        res.json({
            status: 'success',
            data: {
                projects: projectCount,
                messages: messageCount,
                unreadMessages: unreadCount
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch dashboard statistics'
        });
    }
});

export default router;
