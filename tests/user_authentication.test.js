import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';

const api = supertest(app);

describe('create new user', () => {
  test('should create new user', async () => {
    const newUser = {
      username: 'testUser',
      name: 'testName',
      password: 'testPassword8391!',
    };

    const createdUser = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(createdUser.body.username).toBe('testUser');
    expect(createdUser.body.name).toBe('testName');
    expect(createdUser.body.passwordHash).not.toBeDefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
