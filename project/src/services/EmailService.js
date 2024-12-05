const RateLimiter = require('../utils/RateLimiter');
const CircuitBreaker = require('../utils/CircuitBreaker');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.sentEmails = new Map();
    this.rateLimiter = new RateLimiter(60, 60000);
    this.circuitBreaker = new CircuitBreaker();
  }

  async sendEmail(email, providers) {
    const emailId = this._generateEmailId(email);

    if (this.sentEmails.has(emailId)) {
      logger.info('Returning cached email result', { emailId });
      return this.sentEmails.get(emailId);
    }

    if (!(await this.rateLimiter.tryAcquire())) {
      const error = new Error('Rate limit exceeded');
      error.code = 'RATE_LIMIT_EXCEEDED';
      throw error;
    }

    return await this._attemptSend(email, providers, emailId);
  }

  _generateEmailId(email) {
    return `${email.to}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async _attemptSend(email, providers, emailId) {
    for (let attempt = 0; attempt < 3; attempt++) {
      for (const provider of providers) {
        try {
          logger.debug('Attempting to send email', {
            provider: provider.getName(),
            attempt: attempt + 1
          });

          const result = await this.circuitBreaker.execute(() => 
            provider.sendEmail(email)
          );
          
          this.sentEmails.set(emailId, result);
          return result;
        } catch (error) {
          logger.warn(`Email send attempt failed`, {
            provider: provider.getName(),
            attempt: attempt + 1,
            error: error.message
          });
          
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    const error = new Error('Failed to send email after all attempts');
    error.code = 'MAX_RETRIES_EXCEEDED';
    throw error;
  }
}

module.exports = EmailService;