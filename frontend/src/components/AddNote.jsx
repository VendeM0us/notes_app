/* eslint-disable react/prop-types */
import { useState } from 'react';

const AddNote = ({ createNote }) => {
  const [newNote, setNewNote] = useState('');

  const handleChange = (event) => {
    setNewNote(event.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: Math.random() > 0.5,
    });

    setNewNote('');
  };

  return (
    <form onSubmit={addNote}>
      <input
        type='text'
        value={newNote}
        name='new-note'
        onChange={handleChange}
      />
      <button type='submit'>save</button>
    </form>
  );
};

export default AddNote;
