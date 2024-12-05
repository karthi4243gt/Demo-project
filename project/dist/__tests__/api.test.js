import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server';

describe('API Endpoints', () => {
  let server;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/email/send', () => {
    it('should send email successfully', async () => {
      const response = await request(server)
        .post('/api/email/send')
        .send({
          to: 'test@example.com',
          subject: 'Test Email',
          body: 'Hello World'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(server)
        .post('/api/email/send')
        .send({
          to: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(server)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'healthy' });
    });
  });
});