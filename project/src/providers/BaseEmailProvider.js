/**
 * Base class for email providers defining the common interface
 */
class BaseEmailProvider {
  async sendEmail(email) {
    throw new Error('sendEmail must be implemented by provider');
  }

  getName() {
    throw new Error('getName must be implemented by provider');
  }
}

module.exports = BaseEmailProvider;