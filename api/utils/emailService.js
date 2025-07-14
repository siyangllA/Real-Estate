import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const OAuth2 = google.auth.OAuth2;

/**
 * Create a transporter for sending emails using Gmail OAuth2
 */
export const createEmailTransporter = async () => {
  try {
    // Check if all required email credentials are available
    if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
      throw new Error('Email service not configured: Missing OAuth2 credentials');
    }

    const oauth2Client = new OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });

    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, userId, token) => {
  try {
    // Check if email service is configured
    if (!process.env.GMAIL_REFRESH_TOKEN) {
      console.log('Email service not configured - skipping password reset email');
      return { success: false, message: 'Email service not configured' };
    }

    const transporter = await createEmailTransporter();

    const resetUrl = `http://localhost:5173/reset-password/${userId}/${token}`;

    const mailOptions = {
      from: `"Real Estate App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Real Estate App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Real Estate App</h1>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #2563eb;">
            <h2 style="color: #1e293b; margin-top: 0;">Password Reset Request</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your Real Estate App account.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                Reset Your Password
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-bottom: 10px;">
              <strong>Important:</strong> This link will expire in 24 hours for security reasons.
            </p>
            
            <p style="color: #64748b; font-size: 14px;">
              If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
            <p>This email was sent from Real Estate App</p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (email, username) => {
  try {
    // Check if email service is configured
    if (!process.env.GMAIL_REFRESH_TOKEN) {
      console.log('Email service not configured - skipping welcome email');
      return { success: false, message: 'Email service not configured' };
    }

    const transporter = await createEmailTransporter();

    const mailOptions = {
      from: `"Real Estate App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Real Estate App!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Welcome to Real Estate App!</h1>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 30px; border-radius: 10px;">
            <h2 style="color: #1e293b; margin-top: 0;">Hello ${username}!</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Thank you for joining Real Estate App! We're excited to help you find your perfect property or list your own.
            </p>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #1e293b;">What you can do now:</h3>
              <ul style="color: #475569; line-height: 1.8;">
                <li>Browse available properties</li>
                <li>Create and manage your property listings</li>
                <li>Save your favorite properties</li>
                <li>Contact property owners directly</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173" 
                 style="background-color: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                Start Exploring
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
            <p>Happy house hunting!</p>
            <p>The Real Estate App Team</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, message: error.message };
  }
};
