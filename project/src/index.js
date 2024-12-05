const EmailService = require('./EmailService');
const { PrimaryProvider, SecondaryProvider } = require('./EmailProvider');

// Create email service and providers
const emailService = new EmailService();
const primaryProvider = new PrimaryProvider();
const secondaryProvider = new SecondaryProvider();

// Example usage
async function main() {
  const testEmail = {
    to: 'user@example.com',
    subject: 'Test Email',
    body: 'Hello, this is a test email!'
  };

  try {
    const result = await emailService.sendEmail(
      testEmail,
      [primaryProvider, secondaryProvider]
    );
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send email:', error.message);
  }
}

// Run the example
main();