/**
 * Server Entry Point
 * Boots the Express server and handles graceful shutdown
 */

import app from './app.js';
import env from './config/env.js';
import prisma from './prisma/client.js';

const PORT = env.PORT;

/**
 * Start the server
 */
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Portfolio API Server                                  ║
║                                                            ║
║   Environment: ${env.NODE_ENV.padEnd(40)}║
║   Port:        ${String(PORT).padEnd(40)}║
║   URL:         http://localhost:${String(PORT).padEnd(27)}║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);

    server.close(async () => {
        console.log('HTTP server closed.');

        // Disconnect Prisma
        await prisma.$disconnect();
        console.log('Database connection closed.');

        process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

export default server;
