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
    username: 'root',
    name: 'rootUser',
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

  test('creation fails with proper status code and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('password must be at least 8 characters long', async () => {
    const usersAtStart = await helper.usersInDb();

    const shortPassword = {
      username: 'testUser',
      password: 'test'
    };

    const result = await api
      .post('/api/users')
      .send(shortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password must be at least 8 characters long');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('username must be atleast 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb();

    const shortUserName = {
      username: 'lo',
      password: 'dhekldoeka092',
    };

    const result = await api
      .post('/api/users')
      .send(shortUserName)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be atleast 3 characters long');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
