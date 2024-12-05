const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Request error', err, {
    path: req.path,
    method: req.method,
    body: req.body
  });

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;

  res.status(statusCode).json({
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR'
    }
  });
};

module.exports = errorHandler;