const Person = require("../models/person.js");
const User = require("../models/users.js");

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

module.exports = { initialPersons, nonExistingId, personsInDb, usersInDb };
