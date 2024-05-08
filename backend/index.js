const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const middlewares = require("./middlewares/index.js");

const app = express();

morgan.token("req-body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.static('dist'))
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => Math.floor(Math.random() * 100) + 1;

app.get("/info", (req, res) => {
  res.send(
    `<div>
      <p>Phonebook has info for ${persons.length} persons</p>
      <p>${new Date()}</p>
    </div>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ message: "Must contain name and number" });
  }

  const personExist = persons.find(
    (p) => p.name.toLocaleLowerCase().trim() === body.name.toLowerCase().trim()
  );
  if (personExist) {
    return res.status(409).json({ message: "name must be unique" });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(newPerson);
  res.status(201).json(newPerson);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((n) => n.id === id);
  if (!person) {
    return res.status(404).json({ message: `Person with ID ${id} not found` });
  }
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter((n) => n.id !== id);
  res.status(204).end();
});

app.use(middlewares.unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
