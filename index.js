import express from 'express';
import cors from 'cors';
import Note from './models/note.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.post('/api/notes', async (req, res) => {
  const newNote = req.body.content;
  const isImportant = req.body.important;

  if (!newNote || isImportant !== true && isImportant !== false) {
    res.status(400).json({
      error: "The request body should contain content (string) and important (boolean) field"
    })
  } else {
    const note = new Note({
      content: newNote,
      date: new Date(),
      important: isImportant,
    });
  
    await note.save();
    res.status(201).json(note);
  }
});

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is listening on port ", PORT));