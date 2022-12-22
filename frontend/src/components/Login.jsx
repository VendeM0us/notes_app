import { useState } from 'react';
import PropTypes from 'prop-types';
import noteService from '../services/notes.js';
import loginService from '../services/login.js';

const Login = ({ updateUser, handleError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const credentials = { username, password };
      const user = await loginService.login(credentials);

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      );

      noteService.setToken(user.token);
      updateUser(user);
      setUsername('');
      setPassword('');
    } catch {
      handleError('Wrong credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
        username
          <input
            type='text'
            id='username'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
        password
          <input
            type='password'
            id='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type='submit'>login</button>
      </form>
    </div>
  );
};

Login.propTypes = {
  updateUser: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired
};

export default Login;
