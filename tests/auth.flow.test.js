import request from 'supertest';
import app from '../app.js';

let token = '';
const user = {
  username: `flow_${Date.now()}`,
  password: 'password123',
  email: `flow_${Date.now()}@mail.com`
};

describe('Auth Flow', () => {
  test('Register user', async () => {
    const res = await request(app).post('/auth/register').send(user);
    expect(res.statusCode).toBe(201);
  });

  test('Login user and get token', async () => {
    const res = await request(app).post('/auth/login').send({
      username: user.username,
      password: user.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  test('Access profile', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('Update profile', async () => {
    const res = await request(app)
      .patch('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ job_title: 'Testare' });
    expect(res.statusCode).toBe(200);
  });

  test('Logout user', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
