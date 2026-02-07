/**
 * Email Service
 * Sends email notifications using Resend API (HTTP-based, works on all cloud hosts)
 */

import { Resend } from 'resend';
import env from '../config/env.js';

// Create Resend client
const getResendClient = () => {
    if (!env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured. Email notifications will be skipped.');
        return null;
    }
    return new Resend(env.RESEND_API_KEY);
};

/**
 * Send contact notification email
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Sender's name
 * @param {string} contactData.email - Sender's email
 * @param {string} contactData.message - Message content
 */
export const sendContactNotification = async ({ name, email, message }) => {
    const resend = getResendClient();

    if (!resend) {
        console.log('Email client not configured, skipping notification.');
        return false;
    }

    const toEmail = env.NOTIFICATION_EMAIL || 'vasupankajdbd@gmail.com';

    try {
        const { data, error } = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: [toEmail],
            subject: `🔔 New Contact Message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6366f1;">New Contact Form Submission</h2>
                    <hr style="border: 1px solid #e5e5e5;">
                    
                    <p><strong>From:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    
                    <h3 style="color: #333;">Message:</h3>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1;">
                        <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                    </div>
                    
                    <hr style="border: 1px solid #e5e5e5; margin-top: 20px;">
                    <p style="color: #888; font-size: 12px;">
                        Sent from your portfolio website contact form.
                    </p>
                </div>
            `,
            text: `
New Contact Form Submission

From: ${name}
Email: ${email}

Message:
${message}

---
Sent from your portfolio website contact form.
            `,
        });

        if (error) {
            console.error('Failed to send contact notification:', error.message);
            return false;
        }

        console.log(`Contact notification sent for message from ${email}, id: ${data.id}`);
        return true;
    } catch (error) {
        console.error('Failed to send contact notification:', error.message);
        return false;
    }
};

export default {
    sendContactNotification,
};
