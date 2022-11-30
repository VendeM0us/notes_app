import express from 'express';
import cors from 'cors';
import Note from './models/note.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/api/notes/:id', async (req, res, next) => {
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

app.put('/api/notes/:id', async (req, res, next) => {
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

app.post('/api/notes', async (req, res, next) => {
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

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

app.use((req, res) => {
  res.status(404).json({
    message: "Resource Not Found (404)"
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).json({
    status: 500,
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is listening on port ", PORT));