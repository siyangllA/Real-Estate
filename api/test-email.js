import { sendPasswordResetEmail, sendWelcomeEmail } from './utils/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

// Test email functionality
async function testEmail() {
  try {
    console.log('Testing email configuration...');
    
    // Test password reset email
    console.log('Sending test password reset email...');
    await sendPasswordResetEmail(
      'test@example.com', 
      '507f1f77bcf86cd799439011', 
      'test-token-123'
    );
    console.log('✅ Password reset email test passed!');

    // Test welcome email
    console.log('Sending test welcome email...');
    await sendWelcomeEmail('test@example.com', 'TestUser');
    console.log('✅ Welcome email test passed!');

    console.log('🎉 All email tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n📝 Make sure to update your .env file with:');
    console.log('GMAIL_USER=your-email@gmail.com');
    console.log('GMAIL_CLIENT_ID=your-google-client-id');
    console.log('GMAIL_CLIENT_SECRET=your-google-client-secret');
    console.log('GMAIL_REFRESH_TOKEN=your-refresh-token');
  }
}

// Run the test
testEmail();
