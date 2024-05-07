import axios from "axios";

const baseUrl = "/persons";

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (personObject) => {
  return axios.post(baseUrl, personObject);
};

export default { getAll, create };
