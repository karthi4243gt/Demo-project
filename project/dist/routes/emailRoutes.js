const express = require('express');
const router = express.Router();
const { validateEmailRequest } = require('../middleware/requestValidator');
const EmailService = require('../services/EmailService');
const { PrimaryProvider, SecondaryProvider } = require('../providers/EmailProvider');
const logger = require('../utils/logger');

const emailService = new EmailService();
const providers = [
  new PrimaryProvider(),
  new SecondaryProvider()
];

router.post('/send', validateEmailRequest, async (req, res, next) => {
  try {
    logger.info('Processing email request', { to: req.body.to });
    
    const result = await emailService.sendEmail(req.body, providers);
    
    logger.info('Email sent successfully', { 
      messageId: result.id,
      provider: result.provider 
    });
    
    res.status(200).json({
      message: 'Email sent successfully',
      messageId: result.id,
      provider: result.provider
    });
  } catch (error) {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      return res.status(429).json({
        error: {
          code: error.code,
          message: 'Too many requests, please try again later'
        }
      });
    }
    next(error);
  }
});

module.exports = router;