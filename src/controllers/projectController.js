/**
 * Project Controller
 * Handles HTTP requests for project endpoints
 */

import * as projectService from '../services/projectService.js';
import asyncHandler from '../middlewares/asyncHandler.js';

/**
 * Get all projects
 * GET /api/projects
 */
export const getProjects = asyncHandler(async (req, res) => {
    const { featured } = req.query;
    const featuredOnly = featured === 'true';

    const projects = await projectService.getAllProjects({ featuredOnly });

    res.status(200).json({
        status: 'success',
        results: projects.length,
        data: {
            projects
        }
    });
});

/**
 * Get a single project by ID
 * GET /api/projects/:id
 */
export const getProject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await projectService.getProjectById(id);

    if (!project) {
        return res.status(404).json({
            status: 'fail',
            message: 'Project not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            project
        }
    });
});

export default {
    getProjects,
    getProject
};
