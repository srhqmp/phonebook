import axios from "axios";

const baseUrl = "/api/persons";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (personObject) => {
  const config = {
    headers: { Authorization: token },
  };

  return axios.post(baseUrl, personObject, config);
};

const deleteOne = (id) => {
  const config = {
    headers: { Authorization: token },
  };

  return axios.delete(`${baseUrl}/${id}`, config);
};

const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  return axios.put(`${baseUrl}/${id}`, newObject, config);
};

export default { getAll, create, deleteOne, update, setToken };
