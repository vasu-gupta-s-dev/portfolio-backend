/**
 * Authentication Middleware
 * Verifies JWT token and protects admin routes
 */

import authService from '../services/authService.js';

/**
 * Middleware to verify JWT token
 * Attaches admin info to req.admin if valid
 */
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

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

    // Get admin info
    const admin = await authService.getAdminById(decoded.id);

    if (!admin) {
        return res.status(403).json({
            status: 'error',
            message: 'Admin not found'
        });
    }

    req.admin = admin;
    next();
};

export default { authenticateToken };
