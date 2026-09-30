const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Ensure dotenv is loaded before email configuration is accessed
dotenv.config({ path: path.join(__dirname, '../.env') });
if ((!process.env.EMAIL_USER || !process.env.EMAIL_PASS) && fs.existsSync(path.join(__dirname, '../backend/.env'))) {
  dotenv.config({ path: path.join(__dirname, '../backend/.env'), override: true });
}

let cachedTransporter = null;
let cachedCredentialsHash = null;

/**
 * Creates, verifies, and returns the Nodemailer transporter.
 * Strictly verifies EMAIL_USER and EMAIL_PASS from .env.
 */
const getTransporter = async () => {
  // Reload if credentials were not available initially
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    dotenv.config({ path: path.join(__dirname, '../.env'), override: true });
    if ((!process.env.EMAIL_USER || !process.env.EMAIL_PASS) && fs.existsSync(path.join(__dirname, '../backend/.env'))) {
      dotenv.config({ path: path.join(__dirname, '../backend/.env'), override: true });
    }
  }

  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = Number(process.env.EMAIL_PORT) || 587;
  const isSecure = process.env.EMAIL_SECURE === 'true';
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');

  if (
    !user ||
    !pass ||
    user === 'YOUR_EMAIL' ||
    user === 'YOUR_GMAIL_ADDRESS' ||
    user === 'your-email@gmail.com' ||
    pass === 'YOUR_GMAIL_APP_PASSWORD' ||
    pass === 'your-gmail-app-password'
  ) {
    console.error('❌ [SMTP CONFIGURATION ERROR]: EMAIL_USER and/or EMAIL_PASS are missing in .env.');
    console.error('   Real emails cannot be delivered until a valid sender email and app password are provided.');
    throw new Error('SMTP credentials are not configured in .env. Please configure EMAIL_USER and EMAIL_PASS.');
  }

  const currentCredentialsHash = `${host}:${port}:${isSecure}:${user}:${pass}`;
  if (cachedTransporter && cachedCredentialsHash === currentCredentialsHash) {
    return cachedTransporter;
  }

  const transportConfig = {
    host,
    port,
    secure: isSecure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  const transporter = nodemailer.createTransport(transportConfig);

  try {
    await transporter.verify();
    console.log('SMTP configuration verified successfully.');
    cachedTransporter = transporter;
    cachedCredentialsHash = currentCredentialsHash;
    return cachedTransporter;
  } catch (err) {
    console.error(`SMTP connection failed: ${err.message}`);
    if (host.includes('gmail')) {
      console.error('💡 [Gmail Tip]: Ensure 2-Step Verification is enabled on your Google Account and use a 16-character App Password (not your personal account password).');
    }
    throw new Error(`SMTP connection failed: ${err.message}`);
  }
};

const getBrevoKey = () => {
  return (process.env.BREVO_API_KEY || '').trim();
};

/**
 * Sends transactional email via Brevo REST API.
 */
const sendViaBrevo = async ({ to, name, subject, htmlContent, textContent }) => {
  const apiKey = getBrevoKey();
  const senderEmail = (process.env.BREVO_SENDER_EMAIL || 'ramyasri15007@gmail.com').trim();
  const senderName = process.env.BREVO_SENDER_NAME || 'KIET College Portal';

  console.log(`📡 [Brevo API] Sending password reset email to ${to} from ${senderEmail}...`);

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to, name: name || 'User' }],
      subject,
      htmlContent,
      textContent,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data?.message || response.statusText || 'Brevo API error';
    throw new Error(`Brevo API Error (${response.status}): ${errorMsg}`);
  }

  console.log(`📧 [Brevo Dispatched] Password reset email delivered to ${to} (MessageId: ${data.messageId})`);
  return { delivered: true, messageId: data.messageId };
};

/**
 * Sends a password reset email to the verified registered user.
 *
 * @param {Object} options
 * @param {string} options.to - Registered user's email address
 * @param {string} options.resetUrl - Password reset URL containing raw token
 * @param {number} [options.minutesToExpire=15] - Expiry window in minutes
 * @param {string} [options.name='User'] - Recipient full name
 * @returns {Promise<{ delivered: boolean, messageId: string }>}
 */
const sendPasswordResetEmail = async ({ to, resetUrl, minutesToExpire = 30, name = 'User' }) => {
  const subject = 'Reset Your Password';
  const textContent = `Hello,

We received a request to reset your password.

Click the link below to create a new password:
${resetUrl}

This link will expire in ${minutesToExpire} minutes.

If you did not request a password reset, you can safely ignore this email.

For security reasons, never share this link with anyone.

Regards,
KIET Student Management System`;

  const htmlContent = `
    <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #1e3a8a; margin: 0 0 6px 0; font-size: 22px;">KIET Group of Institutions</h2>
        <p style="color: #64748b; margin: 0; font-size: 14px;">College Management & Student Portfolio Dashboard</p>
      </div>

      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 12px;">Hello,</p>
      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        We received a request to reset your password.<br/>
        Click the button below to create a new password.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 15px; letter-spacing: 0.2px;">Reset Password</a>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 20px;">
        Or copy and paste this link into your browser:<br/>
        <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
      </p>

      <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 22px 0; border-radius: 6px;">
        <p style="font-size: 13px; color: #334155; margin: 0; font-weight: 500;">
          ⏳ <strong>Notice:</strong> This link will expire in <strong>${minutesToExpire} minutes</strong>.
        </p>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 10px;">
        If you did not request a password reset, you can safely ignore this email.
      </p>
      <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 0;">
        🔒 For security reasons, never share this link with anyone.
      </p>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
        KIET Student Management System • Security Team
      </p>
    </div>
  `;

  // 1. Try sending directly through Brevo API if configured
  const brevoKey = getBrevoKey();
  if (brevoKey) {
    try {
      return await sendViaBrevo({ to, name, subject, htmlContent, textContent });
    } catch (brevoErr) {
      console.warn(`⚠️ [Brevo Warning] Failed to deliver via Brevo API: ${brevoErr.message}. Trying SMTP fallback...`);
    }
  }

  // 2. SMTP fallback
  const transporter = await getTransporter();
  const sender = (process.env.EMAIL_USER || '').trim();

  try {
    const info = await transporter.sendMail({
      from: sender,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log(`📧 [Email Dispatched] Password reset email delivered to ${to} (MessageId: ${info.messageId})`);
    return { delivered: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ [SMTP Delivery Error] Failed to send email to ${to}:`, err.message);
    throw err;
  }
};

/**
 * Helper to explicitly test and verify the SMTP connection.
 */
const verifyTransporter = async () => {
  const transporter = await getTransporter();
  return transporter.verify();
};

module.exports = {
  getTransporter,
  sendPasswordResetEmail,
  verifyTransporter,
};
