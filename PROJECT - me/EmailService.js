class EmailService {
  constructor(providers, maxRetries = 3, rateLimit = 5) {
    this.providers = providers;
    this.currentProviderIndex = 0;
    this.maxRetries = maxRetries;
    this.rateLimit = rateLimit;
    this.requestCount = 0;
    this.statusTracker = {};
    this.queue = [];
    this.rateLimitResetTime = Date.now();
  }

  async sendEmail(to, subject, body, requestId) {
    // Ensure idempotency
    if (this.statusTracker[requestId]) 
    {
      console.log(`Duplicate request detected: ${requestId}`);
      return this.statusTracker[requestId];
    }

    if (this.requestCount >= this.rateLimit) 
    {
      console.log("Rate limit exceeded. Adding email to queue.");
      return this.addToQueue(() => this.sendEmail(to, subject, body, requestId));
    }

    this.requestCount++;
    this.resetRateLimitAfterOneMinute();

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      const provider = this.providers[this.currentProviderIndex];

      try {
        console.log(`Attempt ${attempt} using ${provider.name}`);
        const result = await provider.sendEmail(to, subject, body);
        this.statusTracker[requestId] = { status: "success", result };
        return result;
      } catch (error) {
        console.error(`Attempt ${attempt} failed with ${provider.name}`);

        if (attempt === this.maxRetries) 
        {
          this.switchProvider();
        }

        await this.exponentialBackoff(attempt);
      }
    }

    this.statusTracker[requestId] = { status: "failed", error: "All retries failed" };
    throw new Error("All retries failed");
  }

  switchProvider() {
    this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
    console.log(`Switched to provider ${this.providers[this.currentProviderIndex].name}`);
  }

  async exponentialBackoff(attempt) {
    const delay = Math.pow(2, attempt) * 100;
    console.log(`Backing off for ${delay}ms`);
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  addToQueue(task) {
    this.queue.push(task);
    this.processQueue();
  }

  async processQueue() {
    while (this.queue.length) {
      const task = this.queue.shift();
      await task();
    }
  }

  resetRateLimitAfterOneMinute() {
    const now = Date.now();
    if (now - this.rateLimitResetTime > 60000) {
      this.requestCount = 0;
      this.rateLimitResetTime = now;
    }
  }
}

class MockEmailProvider {
  constructor(name) {
    this.name = name;
  }

  async sendEmail(to, subject, body) {
    return new Promise((resolve, reject) => {
      const isSuccess = Math.random() > 0.5; // Simulate random success/failure
      setTimeout(() => {
        if (isSuccess) {
          console.log(`${this.name}: Email sent successfully`);
          resolve(`${this.name}: Email sent`);
        } else {
          console.log(`${this.name}: Failed to send email`);
          reject(new Error(`${this.name}: Failed to send email`));
        }
      }, 500); // Simulate processing delay
    });
  }
}

(async () => {
  const provider1 = new MockEmailProvider("Provider1");
  const provider2 = new MockEmailProvider("Provider2");
  const emailService = new EmailService([provider1, provider2]);

  try {
    const result1 = await emailService.sendEmail(
      "user@example.com",
      "Welcome!",
      "Thank you for signing up.",
      "request-1"
    );
    console.log(result1);

    const result2 = await emailService.sendEmail(
      "user@example.com",
      "Welcome again!",
      "This is a duplicate request.",
      "request-1" // Testing idempotency
    );
    console.log(result2);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
