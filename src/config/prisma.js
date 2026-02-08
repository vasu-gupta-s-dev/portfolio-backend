/**
 * Prisma Client Configuration
 * Singleton instance of Prisma Client for database operations
 */

import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma client instance to avoid multiple connections
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
