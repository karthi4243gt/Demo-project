const BaseEmailProvider = require('./BaseEmailProvider');

class PrimaryEmailProvider extends BaseEmailProvider {
  async sendEmail(email) {
    // Simulate network latency and random failures
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (Math.random() < 0.3) {
      throw new Error('Primary provider temporary failure');
    }
    
    return { id: `primary_${Date.now()}`, provider: 'primary' };
  }

  getName() {
    return 'primary';
  }
}

module.exports = PrimaryEmailProvider;