const emailValidator = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateEmailPayload: (payload) => {
    const errors = [];

    if (!payload.to) {
      errors.push('Recipient email is required');
    } else if (!emailValidator.isValidEmail(payload.to)) {
      errors.push('Invalid recipient email format');
    }

    if (!payload.subject) {
      errors.push('Subject is required');
    } else if (payload.subject.length > 200) {
      errors.push('Subject must be less than 200 characters');
    }

    if (!payload.body) {
      errors.push('Email body is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

module.exports = emailValidator;