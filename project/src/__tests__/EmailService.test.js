import { describe, test, expect, vi, beforeEach } from 'vitest';
import EmailService from '../EmailService';
import BaseEmailProvider from '../providers/BaseEmailProvider';

class MockProvider extends BaseEmailProvider {
  constructor(name, shouldFail = false) {
    super();
    this.name = name;
    this.shouldFail = shouldFail;
  }

  async sendEmail(email) {
    if (this.shouldFail) {
      throw new Error(`${this.name} provider failure`);
    }
    return { id: `${this.name}_123`, provider: this.name };
  }

  getName() {
    return this.name;
  }
}

describe('EmailService', () => {
  let emailService;
  let primaryProvider;
  let secondaryProvider;

  beforeEach(() => {
    primaryProvider = new MockProvider('primary');
    secondaryProvider = new MockProvider('secondary');
    emailService = new EmailService(primaryProvider, secondaryProvider);
  });

  test('successfully sends email through primary provider', async () => {
    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test email'
    });

    expect(result.provider).toBe('primary');
  });

  test('falls back to secondary provider when primary fails', async () => {
    primaryProvider.shouldFail = true;
    
    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test email'
    });

    expect(result.provider).toBe('secondary');
  });

  test('maintains idempotency for duplicate sends', async () => {
    const email = {
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test email',
      idempotencyKey: 'test-key'
    };

    const firstResult = await emailService.sendEmail(email);
    const secondResult = await emailService.sendEmail(email);

    expect(firstResult).toEqual(secondResult);
  });
});