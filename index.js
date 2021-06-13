require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const morganBody = require("morgan-body");
morganBody(app);

const Person = require("./models/phonebook");

app.use(express.static("build"));

app.use(express.json());

// GET information about phonebook
app.get("/info", (req, res) => {
  Person.find({})
    .then((persons) => {
      const numberOfPersons = persons.length;
      const message = `<div>Phonebook has info for ${numberOfPersons} people</div><div>${new Date()}</div>`;
      return res.end(message);
    })
    .catch((err) => next(err));
});

// GET all persons
app.get("/api/persons/", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      return res.json(persons);
    })
    .catch((err) => next(err));
});

// GET specific person
app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        return res.json(person);
      } else {
        return res.status(404).send({
          error: `Person with ${id} was not found`,
        });
      }
    })
    .catch((err) => next(err));
});

// DELETE specific person
app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndRemove(id)
    .then(() => {
      return res.status(204).end();
    })
    .catch((err) => next(err));
});

// POST create new person
app.post("/api/persons/", (req, res, next) => {
  const person = req.body;
  const personName = person.name;
  const personNumber = person.number;

  if (!personName || !personNumber) {
    return res.status(400).json({
      error: `Missing required ${personName ? "number" : "name"}`,
    });
  } else {
    const person = new Person({
      name: personName,
      number: personNumber,
      date: new Date(),
    });
    person
      .save()
      .then((person) => {
        return res.json(person);
      })
      .catch((err) => next(err));
  }
});

//UPDATE person
app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const number = req.body.number;

  if (!number) {
    return res.status(400).send({ error: "missing number" });
  }

  const person = {
    number: number,
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      return res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: "unknown endpoint",
  });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "mishandled id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
