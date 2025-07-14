import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Create a transporter for sending emails using Gmail App Password
 */
export const createEmailTransporter = async () => {
  try {
    // Check if all required email credentials are available
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Email service not configured: Missing Gmail credentials');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
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
    if (!process.env.GMAIL_APP_PASSWORD) {
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
    if (!process.env.GMAIL_APP_PASSWORD) {
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

/**
 * Send OTP email for registration
 */
export const sendRegistrationOTP = async (email, otp) => {
  try {
    // Check if email service is configured
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.log('Email service not configured - skipping registration OTP email');
      return { success: false, message: 'Email service not configured' };
    }

    const transporter = await createEmailTransporter();

    const mailOptions = {
      from: `"Real Estate App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Registration OTP - Real Estate App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Real Estate App</h1>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 30px; border-radius: 10px; border-left: 4px solid #2563eb;">
            <h2 style="color: #1e293b; margin-top: 0;">Email Verification</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Thank you for signing up with Real Estate App! Please use the following OTP to verify your email address and complete your registration.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #2563eb; color: white; padding: 20px 30px; border-radius: 8px; display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-bottom: 10px;">
              <strong>Important:</strong> This OTP will expire in 10 minutes for security reasons.
            </p>
            
            <p style="color: #64748b; font-size: 14px;">
              If you didn't sign up for an account, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
            <p>This email was sent from Real Estate App</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Registration OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending registration OTP email:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send OTP email for password reset
 */
export const sendPasswordResetOTP = async (email, otp) => {
  try {
    // Check if email service is configured
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.log('Email service not configured - skipping password reset OTP email');
      return { success: false, message: 'Email service not configured' };
    }

    const transporter = await createEmailTransporter();

    const mailOptions = {
      from: `"Real Estate App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - Real Estate App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Real Estate App</h1>
          </div>
          
          <div style="background-color: #fef2f2; padding: 30px; border-radius: 10px; border-left: 4px solid #ef4444;">
            <h2 style="color: #1e293b; margin-top: 0;">Password Reset Request</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your Real Estate App account. Please use the following OTP to verify your identity and reset your password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #ef4444; color: white; padding: 20px 30px; border-radius: 8px; display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-bottom: 10px;">
              <strong>Important:</strong> This OTP will expire in 10 minutes for security reasons.
            </p>
            
            <p style="color: #64748b; font-size: 14px;">
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
            <p>This email was sent from Real Estate App</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending password reset OTP email:', error);
    return { success: false, message: error.message };
  }
};
