/**
 * Contact Service
 * Business logic for contact form operations
 */

import prisma from '../prisma/client.js';
import { sendContactNotification } from './emailService.js';

/**
 * Create a new contact message
 * @param {Object} data - Contact message data
 * @param {string} data.name - Sender's name
 * @param {string} data.email - Sender's email
 * @param {string} data.message - Message content
 * @returns {Promise<Object>} Created contact message
 */
export const createContactMessage = async ({ name, email, message }) => {
    const contactMessage = await prisma.contactMessage.create({
        data: {
            name,
            email,
            message
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    });

    // Send email notification (non-blocking)
    sendContactNotification({ name, email, message }).catch(err => {
        console.error('Failed to send email notification:', err.message);
    });

    return contactMessage;
};

/**
 * Get all contact messages
 * @param {Object} options - Query options
 * @param {boolean} options.unreadOnly - Filter for unread messages only
 * @returns {Promise<Array>} List of contact messages
 */
export const getAllContactMessages = async ({ unreadOnly = false } = {}) => {
    const where = unreadOnly ? { isRead: false } : {};

    const messages = await prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    });

    return messages;
};

/**
 * Mark a contact message as read
 * @param {number} id - Message ID
 * @returns {Promise<Object>} Updated message
 */
export const markAsRead = async (id) => {
    const message = await prisma.contactMessage.update({
        where: { id: parseInt(id, 10) },
        data: { isRead: true }
    });

    return message;
};

export default {
    createContactMessage,
    getAllContactMessages,
    markAsRead
};
