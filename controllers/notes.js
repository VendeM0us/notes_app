import express from 'express';
import Note from '../models/note.js';

const notesRouter = express.Router();

notesRouter.get('/:id', async (req, res, next) => {
  const foundNote = await Note.findById(req.params.id);

  if (!foundNote) {
    next();
  } else {
    res.json(foundNote);
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

notesRouter.delete('/:id', async (req, res, next) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

notesRouter.post('/', async (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  const savedNote = await note.save();
  res.status(201).json(savedNote);
});

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

export default notesRouter;