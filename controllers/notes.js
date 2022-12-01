import express from 'express';
import Note from '../models/note.js';

const notesRouter = express.Router();

notesRouter.get('/:id', async (req, res, next) => {
  try {
    const foundNote = await Note.findById(req.params.id);
    if (!foundNote) {
      next();
    } else {
      res.json(foundNote);
    }
  } catch (e) {
    next(e);
  }
});

notesRouter.put('/:id', async (req, res, next) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        context: 'query'
      });

    res.json(updatedNote);
  } catch (e) {
    next(e);
  }
});

notesRouter.delete('/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

notesRouter.post('/', async (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  try {
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (e) {
    next(e);
  }
});

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

export default notesRouter;