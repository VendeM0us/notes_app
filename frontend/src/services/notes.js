import axios from 'axios';
const baseUrl = '/api/notes';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.get(baseUrl, config);
  const response = await request;
  return response.data;
};

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.post(baseUrl, newObject, config);
  const response = await request;
  return response.data;
};

const update = async (id, updates) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.patch(`${baseUrl}/${id}`, updates, config);
  const response = await request;
  return response.data;
};

export default { getAll, create, update, setToken };
