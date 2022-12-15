/* eslint-disable react/prop-types */
const Login = ({ onSubmit, username, password, onChangeUsername, onChangePassword }) => (
  <div>
    <h2>Login</h2>

    <form onSubmit={onSubmit}>
      <div>
      username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={onChangeUsername}
        />
      </div>
      <div>
      password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={onChangePassword}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  </div>
);

export default Login;
