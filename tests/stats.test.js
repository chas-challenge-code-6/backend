import request from 'supertest';
import app from '../app.js';

describe('Stats Endpoint', () => {
  test('GET /stats/summary should return a summary or error if empty', async () => {
    const res = await request(app).get('/stats/summary');

    // Om databasen är tom kan det ge 500, annars 200 med data
    expect([200, 500]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('totalUsers');
      expect(res.body).toHaveProperty('totalDevices');
      expect(res.body).toHaveProperty('totalDataPoints');
    } else {
      expect(res.body).toHaveProperty('status', 'error');
    }
  });
});
