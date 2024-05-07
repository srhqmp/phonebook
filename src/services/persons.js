import axios from "axios";

const baseUrl = "/persons";

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (personObject) => {
  return axios.post(baseUrl, personObject);
};

const deleteOne = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, create, deleteOne };
