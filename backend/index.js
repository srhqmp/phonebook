require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const middlewares = require("./middlewares/index.js");
const Person = require("./models/person.js");

const app = express();

morgan.token("req-body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.static("dist"));
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

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(
      `<div>
        <p>Phonebook has info for ${persons.length} persons</p>
        <p>${new Date()}</p>
      </div>`
    );
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((newPerson) => {
    res.status(201).json(newPerson);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((n) => n.id === id);
  if (!person) {
    return res.status(404).json({ message: `Person with ID ${id} not found` });
  }
  res.json(person);
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
