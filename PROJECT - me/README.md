# EmailService: A Resilient Email Sending Service

## Overview
The `EmailService` class is designed to provide a resilient and robust email sending solution. It incorporates features like retry logic, provider switching, rate limiting, idempotency, and status tracking to ensure efficient email delivery. This service works with multiple mock email providers and simulates real-world email-sending scenarios.

---

## Features
### 1. **Retry Logic with Exponential Backoff**
   - Automatically retries failed email sends up to a maximum number of retries.
   - Implements an exponential backoff mechanism to space out retry attempts.

### 2. **Fallback Mechanism**
   - Automatically switches between email providers upon repeated failure with the current provider.

### 3. **Rate Limiting**
   - Limits the number of email requests processed per minute.
   - Excess requests are added to a queue and processed when the rate limit resets.

### 4. **Idempotency**
   - Prevents duplicate email sends by tracking requests using unique `requestId`.

### 5. **Status Tracking**
   - Tracks the status of each email request (e.g., success or failure).

### 6. **Queue System**
   - Emails that exceed the rate limit are queued and processed later.

---

## Prerequisites
- Node.js installed on your system.
- Basic understanding of JavaScript and asynchronous programming.

---

## Usage
### Installation
1. Clone the repository or copy the `EmailService` code into your project.
2. Create a file `EmailService.js` and paste the code there.

### Example
Below is an example of how to use the `EmailService` with mock email providers:

```javascript
const { EmailService, MockEmailProvider } = require("./EmailService");

// Initialize mock providers
const provider1 = new MockEmailProvider("Provider1");
const provider2 = new MockEmailProvider("Provider2");

// Create the email service instance with the providers
const emailService = new EmailService([provider1, provider2]);

(async () => {
  try {
    // Send an email
    const result1 = await emailService.sendEmail(
      "user@example.com",
      "Welcome!",
      "Thank you for signing up.",
      "request-1"
    );
    console.log(result1);

    // Attempt to send a duplicate email (idempotency check)
    const result2 = await emailService.sendEmail(
      "user@example.com",
      "Welcome again!",
      "This is a duplicate request.",
      "request-1"
    );
    console.log(result2);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
```

---

## Classes
### 1. `EmailService`
- **Constructor Parameters**:
  - `providers`: Array of email providers.
  - `maxRetries`: Maximum retry attempts (default: 3).
  - `rateLimit`: Number of requests allowed per minute (default: 5).
- **Methods**:
  - `sendEmail(to, subject, body, requestId)`: Sends an email and handles retries, rate limiting, and idempotency.
  - `switchProvider()`: Switches to the next email provider.
  - `exponentialBackoff(attempt)`: Implements exponential backoff logic.
  - `addToQueue(task)`: Adds a task to the processing queue.
  - `processQueue()`: Processes queued tasks.
  - `resetRateLimitAfterOneMinute()`: Resets the rate limit after one minute.

### 2. `MockEmailProvider`
- Simulates email sending with random success or failure.
- **Constructor Parameters**:
  - `name`: Name of the provider.
- **Methods**:
  - `sendEmail(to, subject, body)`: Simulates email sending.

---

## Key Concepts
### Idempotency
Prevents duplicate emails from being sent by checking if a `requestId` has already been processed.

### Exponential Backoff
Spaces out retry attempts to avoid overloading the provider.

### Rate Limiting
Restricts the number of email sends per minute, with excess requests added to a queue.

---

## Error Handling
- Logs detailed messages for each retry attempt and failure.
- Throws an error if all retry attempts fail.

---

## Output
- Logs the progress of email sending attempts, including retries and fallback provider switches.
- Example:
  ```
  Attempt 1 using Provider1
  Provider1: Email sent successfully
  Provider1: Email sent
  Duplicate request detected: request-1
  Provider1: Email sent
  ```

---

## Testing
Use a testing framework like **Jest** or **Mocha** to test the functionality:
- Verify retries and exponential backoff.
- Test rate limiting and queue handling.
- Confirm idempotency and status tracking.
