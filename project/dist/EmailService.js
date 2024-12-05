// Simple email service with retry and fallback capabilities
class EmailService {
  constructor() {
    // Store sent emails to prevent duplicates
    this.sentEmails = new Map();
    // Track request timestamps for rate limiting
    this.requestTimes = [];
    // Maximum requests per minute
    this.maxRequestsPerMinute = 60;
  }

  // Check if we're within rate limits
  _checkRateLimit() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Remove old requests
    this.requestTimes = this.requestTimes.filter(time => time > oneMinuteAgo);
    
    // Check if we're over the limit
    if (this.requestTimes.length >= this.maxRequestsPerMinute) {
      return false;
    }
    
    // Add new request
    this.requestTimes.push(now);
    return true;
  }

  // Main method to send emails
  async sendEmail(email, providers) {
    // Check for required fields
    if (!email.to || !email.subject || !email.body) {
      throw new Error('Missing required email fields');
    }

    // Generate unique ID for this email
    const emailId = `${email.to}-${Date.now()}`;

    // Check for duplicate sends
    if (this.sentEmails.has(emailId)) {
      console.log('Duplicate email detected, returning cached result');
      return this.sentEmails.get(emailId);
    }

    // Check rate limit
    if (!this._checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Try sending with each provider
    for (let attempt = 0; attempt < 3; attempt++) {
      for (const provider of providers) {
        try {
          // Attempt to send email
          const result = await provider.sendEmail(email);
          
          // Store successful result
          this.sentEmails.set(emailId, result);
          
          console.log(`Email sent successfully via ${provider.constructor.name}`);
          return result;
        } catch (error) {
          console.log(`Attempt ${attempt + 1} failed with ${provider.constructor.name}:`, error.message);
          
          // Wait before retry (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error('Failed to send email after all attempts');
  }
}

module.exports = EmailService;