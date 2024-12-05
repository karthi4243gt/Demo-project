const serverless = require('serverless-http');
const app = require('../../src/server');

// Wrap express app with serverless handler
module.exports.handler = serverless(app);