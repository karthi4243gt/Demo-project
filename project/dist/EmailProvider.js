// Base class for email providers
class EmailProvider {
  // Send email method that must be implemented by child classes
  async sendEmail(email) {
    throw new Error('sendEmail must be implemented');
  }
}

// Primary email provider implementation
class PrimaryProvider extends EmailProvider {
  async sendEmail(email) {
    // Simulate sending email with primary provider
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate random failure (30% chance)
    if (Math.random() < 0.3) {
      throw new Error('Primary provider failed');
    }
    
    return {
      success: true,
      id: `primary-${Date.now()}`
    };
  }
}

// Secondary (backup) email provider implementation
class SecondaryProvider extends EmailProvider {
  async sendEmail(email) {
    // Simulate sending email with secondary provider
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate random failure (20% chance)
    if (Math.random() < 0.2) {
      throw new Error('Secondary provider failed');
    }
    
    return {
      success: true,
      id: `secondary-${Date.now()}`
    };
  }
}

module.exports = {
  PrimaryProvider,
  SecondaryProvider
};