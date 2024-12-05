# Resilient Email Service

A production-ready email service with built-in resilience patterns including retry logic, circuit breakers, and rate limiting.

## Features

- 🔄 Retry mechanism with exponential backoff
- 🔀 Provider fallback system
- 🎯 Idempotency handling
- 🚦 Rate limiting
- 💫 Circuit breaker pattern
- 📝 Detailed logging
- 🔒 Security features (CORS, Helmet)
- 🧪 Comprehensive test suite

## Live Demo

The API is deployed and accessible at:
https://heartfelt-tanuki-c51ed6.netlify.app

### API Endpoints

#### Send Email
```http
POST /api/email/send
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Hello",
  "body": "Email content"
}
```

#### Health Check
```http
GET /health
```

## Deployment

### Current Deployment

The service is deployed on Netlify as a serverless function. The deployment process is automated through GitHub integration and Netlify's CI/CD pipeline.

### Deployment Configuration

The project uses the following deployment configuration:

- Platform: Netlify
- Build Command: `npm run build`
- Functions Directory: `netlify/functions`
- Publish Directory: `public`

### Deploy Your Own Instance

1. Fork the repository
2. Sign up for Netlify (if you haven't already)
3. Connect your GitHub repository to Netlify
4. Configure the deployment settings:
   - Build command: `npm run build`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
5. Deploy!

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/resilient-email-service.git
cd resilient-email-service
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
PORT=3000
NODE_ENV=development
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Testing

Run tests:
```bash
# Run once
npm test

# Watch mode
npm run test:watch
```

## Architecture

```
src/
├── providers/      # Email provider implementations
├── routes/         # API route handlers
├── services/       # Core business logic
├── utils/          # Utility classes
└── server.js       # Express application setup
```

## Security Features

- CORS protection
- Helmet security headers
- Rate limiting
- Input validation
- Request sanitization

## Error Handling

The service implements comprehensive error handling:

- Circuit breaker for external service failures
- Exponential backoff for retries
- Detailed error logging
- Client-friendly error messages

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT