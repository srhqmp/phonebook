const bcrypt = require("bcrypt");

const Person = require("../models/person.js");
const User = require("../models/user.js");

const initialPersons = [
  {
    name: "Sarah",
    number: "09-1234567",
  },
  {
    name: "Jane",
    number: "123-45678912",
  },
];

const nonExistingId = async () => {
  const person = new Person({ name: "unknown", number: "12-1234567" });
  await person.save();
  await person.deleteOne();

  return person._id.toString();
};

const personsInDb = async () => {
  const persons = await Person.find({});
  return persons.map((person) => person.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const loginUser = async ({ api, username, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash });
  await user.save();

  const response = await api
    .post("/api/login")
    .send({ username, password })
    .expect(200);

  return { ...response.body, id: user.id };
};

module.exports = {
  initialPersons,
  nonExistingId,
  personsInDb,
  usersInDb,
  loginUser,
};
