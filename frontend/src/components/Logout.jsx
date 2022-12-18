import PropTypes from 'prop-types';

const Logout = ({ user, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <p>
      {user.name} is logged in
      <button type='submit'>logout</button>
    </p>
  </form>
);

Logout.propTypes = {
  user: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default Logout;
