/* eslint-disable react/prop-types */
const Logout = ({ user, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <p>
      {user.name} is logged in
      <button type='submit'>logout</button>
    </p>
  </form>
);

export default Logout;
