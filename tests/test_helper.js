import Note from '../models/note.js';
import User from '../models/user.js';

export const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
];

export const nonExistingId = async () => {
  const note = new Note({ content: 'for removal', date: new Date() });
  await note.save();
  await note.remove();

  return note._id.toString();
};

export const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map(note => note.toJSON());
};

export const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};
