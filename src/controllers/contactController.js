/**
 * Contact Controller
 * Handles HTTP requests for contact form endpoints
 */

import * as contactService from '../services/contactService.js';
import asyncHandler from '../middlewares/asyncHandler.js';

/**
 * Submit contact form
 * POST /api/contact
 */
export const submitContact = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    const contactMessage = await contactService.createContactMessage({
        name,
        email,
        message
    });

    res.status(201).json({
        status: 'success',
        message: 'Thank you for your message! I will get back to you soon.',
        data: {
            contact: contactMessage
        }
    });
});

export default {
    submitContact
};
