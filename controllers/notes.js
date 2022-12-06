import express from 'express';
import jwt from 'jsonwebtoken';
import * as config from '../utils/config.js';
import Note from '../models/note.js';
import User from '../models/user.js';

const notesRouter = express.Router();

const getTokenFrom = req => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7);
  }

  return null;
};

notesRouter.get('/:id', async (req, res, next) => {
  const foundNote = await Note.findById(req.params.id);

  if (foundNote) {
    res.json(foundNote);
  } else {
    next();
  }
});

notesRouter.put('/:id', async (req, res, next) => {
  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      context: 'query'
    });

  res.json(updatedNote);
});

notesRouter.delete('/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

notesRouter.post('/', async (req, res) => {
  const body = req.body;
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  res.status(201).json(savedNote);
});

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
    .populate('user', { username: 1, name: 1 });
  res.json(notes);
});

export default notesRouter;