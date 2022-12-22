import { useState } from 'react';
import PropTypes from 'prop-types';

const AddNote = ({ createNote }) => {
  const [newNote, setNewNote] = useState('');

  const handleChange = (event) => {
    setNewNote(event.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: false,
    });

    setNewNote('');
  };

  return (
    <div className="formDiv">
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          type='text'
          id='add-note'
          value={newNote}
          name='new-note'
          placeholder='your new note here...'
          onChange={handleChange}
        />
        <button type='submit'>save</button>
      </form>
    </div>
  );
};

AddNote.propTypes = {
  createNote: PropTypes.func.isRequired
};

export default AddNote;
