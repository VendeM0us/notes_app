/* eslint-disable react/prop-types */
const AddNote = ({ newNote, onSubmit, onChange }) => (
  <form onSubmit={onSubmit}>
    <input
      type='text'
      value={newNote}
      name='new-note'
      onChange={onChange}
    />
    <button type='submit'>save</button>
  </form>
);

export default AddNote;
