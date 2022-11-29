import express from 'express';
import cors from 'cors';
import Note from './models/note.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/api/notes/:id', async (req, res, next) => {
  const foundNote = await Note.findById(req.params.id);
  if (!foundNote) {
    next();
  } else {
    res.json(foundNote);
  }
});

app.put('/api/notes/:id', async (req, res) => {
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body);
  res.json(updatedNote);
});

app.post('/api/notes', async (req, res) => {
  const newNote = req.body.content;

  if (!newNote) {
    res.status(400).json({
      error: "The request body should contain content (string)"
    })
  } else {
    const note = new Note({
      content: newNote,
      date: new Date(),
      important: req.body.important || false,
    });
  
    const savedNote = await note.save();
    res.status(201).json(savedNote);
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
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is listening on port ", PORT));