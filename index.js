const express = require("express");
const app = express();

app.use(express.static("build"));

const morgan = require("morgan");
app.use(morgan(":method :url :status - :response-time ms"));

const cors = require("cors");
app.use(cors());

// json-parser middleware
app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Sarah",
    number: "123-456-789",
  },
  {
    id: 2,
    name: "Jane",
    number: "444-445-545",
  },
  {
    id: 3,
    name: "Kim",
    number: "233-445-545",
  },
  {
    id: 4,
    name: "Kate",
    number: "3435-4345-545",
  },
];

// GET information about phonebook
app.get("/info", (req, res) => {
  const message = `<div>Phonebook has info for ${
    persons.length
  } people</div><div>${new Date()}</div>`;
  return res.end(message);
});

// GET all persons
app.get("/api/persons/", (req, res) => {
  return res.json(persons);
});

// GET specific person
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return res.status(404).json({
      error: `Person with id ${id} was not found`,
    });
  } else {
    return res.json(person);
  }
});

// DELETE specific person
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  return res.status(204).end();
});

const generateId = () => Math.floor(Math.random() * 100) + persons.length;

const personExists = (name) =>
  persons.find(
    (person) => person.name.toLocaleLowerCase() === name.toLocaleLowerCase()
  );

// POST create new person
app.post("/api/persons/", (req, res) => {
  const person = req.body;
  const personName = person.name;
  const personNumber = person.number;

  if (!personName || !personNumber) {
    return res.status(400).json({
      error: `Missing required ${personName ? "number" : "name"}`,
    });
  } else if (personExists(personName)) {
    return res.status(400).json({
      error: `name must be unique`,
    });
  } else {
    const person = {
      id: generateId(),
      name: personName,
      number: personNumber,
      date: new Date(),
    };
    persons = persons.concat(person);
    return res.json(person);
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: "unknown endpoint",
  });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
