/**
 * Project Service
 * Business logic for project-related operations
 */

import prisma from '../prisma/client.js';

/**
 * Get all projects
 * @param {Object} options - Query options
 * @param {boolean} options.featuredOnly - Filter for featured projects only
 * @returns {Promise<Array>} List of projects
 */
export const getAllProjects = async ({ featuredOnly = false } = {}) => {
    const where = featuredOnly ? { featured: true } : {};

    const projects = await prisma.project.findMany({
        where,
        orderBy: [
            { sortOrder: 'asc' },
            { createdAt: 'desc' }
        ],
        select: {
            id: true,
            title: true,
            description: true,
            techStack: true,
            githubUrl: true,
            liveUrl: true,
            featured: true,
            createdAt: true
        }
    });

    // Transform techStack string to array
    return projects.map(project => ({
        ...project,
        techStack: project.techStack ? project.techStack.split(',').map(t => t.trim()) : []
    }));
};

/**
 * Get a single project by ID
 * @param {number} id - Project ID
 * @returns {Promise<Object|null>} Project or null if not found
 */
export const getProjectById = async (id) => {
    const project = await prisma.project.findUnique({
        where: { id: parseInt(id, 10) }
    });

    if (!project) return null;

    return {
        ...project,
        techStack: project.techStack ? project.techStack.split(',').map(t => t.trim()) : []
    };
};

/**
 * Create a new project
 * @param {Object} data - Project data
 * @returns {Promise<Object>} Created project
 */
export const createProject = async (data) => {
    const techStack = Array.isArray(data.techStack)
        ? data.techStack.join(', ')
        : data.techStack;

    const project = await prisma.project.create({
        data: {
            ...data,
            techStack
        }
    });

    return {
        ...project,
        techStack: project.techStack ? project.techStack.split(',').map(t => t.trim()) : []
    };
};

export default {
    getAllProjects,
    getProjectById,
    createProject
};
