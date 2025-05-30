// tests/app.test.js
import request from 'supertest';
import app from '../app.js';

describe('GET /', () => {
  it('should respond with API status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('API is running');
  });
});
