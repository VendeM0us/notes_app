/* eslint-disable react/prop-types */
import './index.css';

const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important';

  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

export default Note;