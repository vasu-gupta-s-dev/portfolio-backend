/**
 * Prisma Client Singleton
 * Ensures a single database connection instance across the application
 */

import { PrismaClient } from '@prisma/client';
import env from '../config/env.js';

/**
 * Create Prisma client with logging configuration
 */
const createPrismaClient = () => {
    return new PrismaClient({
        log: env.isDevelopment()
            ? ['query', 'info', 'warn', 'error']
            : ['error'],
        errorFormat: env.isDevelopment() ? 'pretty' : 'minimal'
    });
};

// Global variable to store the Prisma instance
const globalForPrisma = globalThis;

// Use existing instance or create a new one
const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Store in global in development to prevent multiple instances during hot reload
if (env.isDevelopment()) {
    globalForPrisma.prisma = prisma;
}

export default prisma;
