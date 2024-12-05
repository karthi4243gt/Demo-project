const emailValidator = require('../utils/validators');

const validateEmailRequest = (req, res, next) => {
  const validation = emailValidator.validateEmailPayload(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid email request',
        details: validation.errors
      }
    });
  }
  
  next();
};

module.exports = {
  validateEmailRequest
};