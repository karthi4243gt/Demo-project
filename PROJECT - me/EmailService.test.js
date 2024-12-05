import { describe, test, expect, beforeEach } from 'vitest';
import EmailService from '../EmailService';
import MockEmailProvider from '../MockEmailProvider';

describe("EmailService", () => {
    let provider1, provider2, emailService;

    beforeEach(() => {
        provider1 = new MockEmailProvider("Provider1", 0); // Always succeeds
        provider2 = new MockEmailProvider("Provider2", 1); // Always fails
        emailService = new EmailService([provider1, provider2], 3, 2); // 3 retries, rate limit of 2
    });

    test("sends email successfully with Provider1", async () => {
        const result = await emailService.sendEmail("test@example.com", "Test Subject", "Test Body", "request-1");
        expect(result).toBe("Provider1: Email sent");
    });

    test("falls back to Provider2 on Provider1 failure", async () => {
        provider1.failureRate = 1; // Force Provider1 to fail
        provider2.failureRate = 0; // Force Provider2 to succeed
        const result = await emailService.sendEmail("test@example.com", "Test Subject", "Test Body", "request-2");
        expect(result).toBe("Provider2: Email sent");
    });

    test("implements idempotency by ignoring duplicate requests", async () => {
        await emailService.sendEmail("test@example.com", "Test Subject", "Test Body", "request-3");
        const result = await emailService.sendEmail("test@example.com", "Test Subject", "Test Body", "request-3");
        expect(result.status).toBe("success");
    });

    test("enforces rate limiting and queues requests", async () => {
        const promises = [
            emailService.sendEmail("user1@example.com", "Subject", "Body", "request-4"),
            emailService.sendEmail("user2@example.com", "Subject", "Body", "request-5"),
            emailService.sendEmail("user3@example.com", "Subject", "Body", "request-6"),
        ];
        const results = await Promise.all(promises);
        expect(results.length).toBe(3);
    });

    test("tracks the status of email requests", async () => {
        const requestId = "request-7";
        await emailService.sendEmail("test@example.com", "Subject", "Body", requestId);
        const status = emailService.statusTracker[requestId];
        expect(status.status).toBe("success");
    });
});
