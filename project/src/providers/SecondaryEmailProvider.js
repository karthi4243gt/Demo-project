const BaseEmailProvider = require('./BaseEmailProvider');

class SecondaryEmailProvider extends BaseEmailProvider {
  async sendEmail(email) {
    // Simulate network latency and random failures
    await new Promise(resolve => setTimeout(resolve, 150));
    
    if (Math.random() < 0.2) {
      throw new Error('Secondary provider temporary failure');
    }
    
    return { id: `secondary_${Date.now()}`, provider: 'secondary' };
  }

  getName() {
    return 'secondary';
  }
}

module.exports = SecondaryEmailProvider;