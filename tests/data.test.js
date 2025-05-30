// tests/data.test.js
import request from 'supertest';
import app from '../app.js';

let token = '';

beforeAll(async () => {
  const user = {
    username: `data_${Date.now()}`,
    password: 'password123',
    email: `data_${Date.now()}@mail.com`
  };

  await request(app).post('/auth/register').send(user);
  const login = await request(app).post('/auth/login').send({
    username: user.username,
    password: user.password
  });

  token = login.body.data.token;
});

describe('Sensor Data Endpoints', () => {
  test('Submit new sensor data', async () => {
    const payload = {
      device_id: 'SENTINEL-001',
      sensors: {
        temperature: 23.5,
        humidity: 55,
        gas: { ppm: 10 },
        fall_detected: false,
        heart_rate: 70,
        noise_level: 0.03,
        steps: 1234,
        device_battery: 90,
        strap_battery: 45
      }
    };

    console.log('📤 Sending sensor data payload:', payload);

    const res = await request(app)
      .post('/api/data')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    console.log('📥 Response from /api/data:', res.body);

    expect(res.statusCode).toBe(201);
  });

  test('Get latest sensor data', async () => {
    const res = await request(app)
      .get('/api/data/latest')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('Health check returns OK', async () => {
    const res = await request(app).get('/api/data/health');
    expect(res.statusCode).toBe(200);
  });
});
