import request from 'supertest';
import app from '../app.js';

describe('Stats Endpoint', () => {
  test('GET /stats/summary should return a summary or error if empty', async () => {
    const res = await request(app).get('/stats/summary');

    expect([200, 500]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('totalEntries');
      expect(res.body).toHaveProperty('deviceCount');
      expect(res.body).toHaveProperty('averages');
      expect(res.body.averages).toHaveProperty('avg_temperature');
      expect(res.body.averages).toHaveProperty('avg_humidity');
      // Du kan fortsätta kolla fler om du vill
    } else {
      expect(res.body).toHaveProperty('error');
    }
  });
});
