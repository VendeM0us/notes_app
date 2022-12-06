import mongoose from 'mongoose';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import * as helper from './test_helper.js';
import app from '../app.js';
import Note from '../models/note.js';
import User from '../models/user.js';

const api = supertest(app);
const auth = {};

const loginUser = async (auth) => {
  const result = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'secretpassword'
    })
    .expect(200);

  auth.token = result.body.token;
};

beforeAll(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('secretpassword', 10);
  const user = new User({
    username: 'root',
    name: 'rootUser',
    passwordHash,
  });

  await user.save();
  await loginUser(auth);
}, 100000);

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(helper.initialNotes);
}, 100000);

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');
    expect(response.body).toHaveLength(helper.initialNotes.length);
  });

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map(r => r.content);
    expect(contents).toContain(
      'Browser can execute only Javascript'
    );
  });
});

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb();

    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));
    expect(resultNote.body).toEqual(processedNoteToView);
  });

  test('failes with status 404 if note does not exist', async () => {
    const nonExistingId = await helper.nonExistingId();

    await api
      .get(`/api/notes/${nonExistingId}`)
      .expect(404);
  });

  test('fails with status 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400);
  });
});

describe('addition of a new note', () => {
  test('requires token authentication', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(401);
  });

  test('a valid note can be added', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .auth(auth.token, { type: 'bearer' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

    const contents = notesAtEnd.map(n => n.content);
    expect(contents).toContain(
      'async/await simplifies making async calls'
    );
  });

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .auth(auth.token, { type: 'bearer' })
      .expect(400);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

describe('deletion of a note', () => {
  test('a note can be deleted', async () => {
    const noteAtStart = await helper.notesInDb();
    const noteToDelete = noteAtStart[0];

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map(r => r.content);
    expect(contents).not.toContain(noteToDelete.content);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
