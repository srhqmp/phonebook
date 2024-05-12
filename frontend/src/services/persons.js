import axios from "axios";

const baseUrl = "/api/persons";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (personObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.post(baseUrl, personObject, config);
  return request.then((response) => response.data);
};

const deleteOne = (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.delete(`${baseUrl}/${id}`, config);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.put(`${baseUrl}/${id}`, newObject, config);
  return request.then((response) => response.data);
};

export default { getAll, create, deleteOne, update, setToken };
