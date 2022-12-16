import { useEffect, useState, useRef } from 'react';
import Note from './components/Note';
import noteService from './services/notes';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import Login from './components/Login';
import Logout from './components/Logout';
import AddNote from './components/AddNote';
import Footer from './components/Footer';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrormessage] = useState(null);
  const [user, setUser] = useState(null);

  const noteFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user === null) return;

    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes));
  }, [user]);

  const handleError = (message) => {
    setErrormessage(message);
    setTimeout(() => {
      setErrormessage(null);
    }, 5000);
  };

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important);

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem('loggedNoteappUser');
    setNotes([]);
    setUser(null);
  };

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id);
    const update = { important: !note.important };

    noteService
      .update(id, update)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote));
      })
      .catch((e) => {
        console.log(e);
        setErrormessage(
          `Note '${note.content}' was already removed from the server`
        );
        setTimeout(() => {
          setErrormessage(null);
        }, 5000);
        setNotes(notes.filter(n => n.id !== id));
      });
  };

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
      });
  };

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <Login
        updateUser={(user) => setUser(user)}
        handleError={handleError}
      />
    </Togglable>
  );

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <AddNote createNote={addNote} />
    </Togglable>
  );

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {
        user === null
          ? loginForm()
          : <div>
            <Logout
              onSubmit={handleLogout}
              user={user}
            />
            {noteForm()}
            <div>
              <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
              </button>
            </div>
            <ul>
              {notesToShow.map(note =>
                <Note key={note.id}
                  note={note}
                  toggleImportance={() => toggleImportanceOf(note.id)}
                />
              )}
            </ul>
          </div>
      }
      <Footer />
    </div>
  );
};

export default App;
