/**
 * Email Service
 * Sends email notifications using Nodemailer
 */

import nodemailer from 'nodemailer';
import env from '../config/env.js';

// Create transporter (uses Gmail by default, but can be configured for other providers)
const createTransporter = () => {
    // Check if email is configured
    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
        console.warn('Email not configured. Notifications will be skipped.');
        return null;
    }

    return nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT || 587,
        secure: env.SMTP_PORT === 465,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
        },
    });
};

/**
 * Send contact notification email
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Sender's name
 * @param {string} contactData.email - Sender's email
 * @param {string} contactData.message - Message content
 */
export const sendContactNotification = async ({ name, email, message }) => {
    const transporter = createTransporter();

    if (!transporter) {
        console.log('Email transporter not configured, skipping notification.');
        return false;
    }

    const mailOptions = {
        from: `"Portfolio Contact" <${env.SMTP_USER}>`,
        to: env.NOTIFICATION_EMAIL || env.SMTP_USER,
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
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Contact notification sent for message from ${email}`);
        return true;
    } catch (error) {
        console.error('Failed to send contact notification:', error.message);
        return false;
    }
};

export default {
    sendContactNotification,
};
