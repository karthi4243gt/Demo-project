const EmailService = require('./EmailService');
const { PrimaryProvider, SecondaryProvider } = require('./EmailProvider');

// Simple test runner
async function runTests() {
  console.log('Running tests...\n');
  let passed = 0;
  let failed = 0;

  // Test 1: Basic email sending
  try {
    const service = new EmailService();
    const result = await service.sendEmail(
      {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test email'
      },
      [new PrimaryProvider(), new SecondaryProvider()]
    );
    
    if (result.success) {
      console.log('✓ Basic email sending test passed');
      passed++;
    } else {
      throw new Error('Email sending failed');
    }
  } catch (error) {
    console.log('✗ Basic email sending test failed:', error.message);
    failed++;
  }

  // Test 2: Rate limiting
  try {
    const service = new EmailService();
    const promises = [];
    
    // Try to send 100 emails quickly
    for (let i = 0; i < 100; i++) {
      promises.push(service.sendEmail(
        {
          to: 'test@example.com',
          subject: 'Test',
          body: 'Test email'
        },
        [new PrimaryProvider(), new SecondaryProvider()]
      ));
    }
    
    await Promise.all(promises).catch(() => {
      // Rate limit error expected
      console.log('✓ Rate limiting test passed');
      passed++;
    });
  } catch (error) {
    console.log('✗ Rate limiting test failed:', error.message);
    failed++;
  }

  // Print test results
  console.log(`\nTests completed: ${passed} passed, ${failed} failed`);
}

// Run the tests
runTests();