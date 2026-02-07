/**
 * Authentication Service
 * Handles admin login, password hashing, and JWT token management
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import env from '../config/env.js';

const SALT_ROUNDS = 12;

/**
 * Hash a password
 */
export const hashPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 */
export const generateToken = (adminId, username) => {
    return jwt.sign(
        { id: adminId, username },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
    );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Login admin user
 */
export const loginAdmin = async (username, password) => {
    // Find admin by username
    const admin = await prisma.admin.findUnique({
        where: { username }
    });

    if (!admin) {
        return { success: false, error: 'Invalid credentials' };
    }

    // Verify password
    const isValid = await comparePassword(password, admin.passwordHash);
    if (!isValid) {
        return { success: false, error: 'Invalid credentials' };
    }

    // Update last login
    await prisma.admin.update({
        where: { id: admin.id },
        data: { lastLogin: new Date() }
    });

    // Generate token
    const token = generateToken(admin.id, admin.username);

    return {
        success: true,
        token,
        admin: {
            id: admin.id,
            username: admin.username,
            email: admin.email
        }
    };
};

/**
 * Create admin user (for initial setup)
 */
export const createAdmin = async (username, password, email = null) => {
    const passwordHash = await hashPassword(password);

    const admin = await prisma.admin.create({
        data: {
            username,
            passwordHash,
            email
        }
    });

    return {
        id: admin.id,
        username: admin.username,
        email: admin.email
    };
};

/**
 * Get admin by ID
 */
export const getAdminById = async (id) => {
    return prisma.admin.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            lastLogin: true,
            createdAt: true
        }
    });
};

export default {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
    loginAdmin,
    createAdmin,
    getAdminById
};
