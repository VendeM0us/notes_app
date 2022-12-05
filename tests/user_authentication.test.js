import mongoose from 'mongoose';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../app.js';
import User from '../models/user.js';
import * as helper from './test_helper.js';

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('secret', 10);
  const user = new User({
    username: 'init',
    name: 'init',
    passwordHash,
  });

  await user.save();
}, 100000);

describe('create new user', () => {
  test('should create new user', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'testUser',
      name: 'testName',
      password: 'testPassword8391!',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
