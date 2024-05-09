/* eslint-disable no-unused-vars */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./utils/config.js");
const middlewares = require("./utils/middleware.js");
const logger = require("./utils/logger.js");
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

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "Must contain name and number" });
  }

  // TODO: Prevent duplicate names

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((newPerson) => {
      res.status(201).json(newPerson);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      res.json(person);
    })
    .catch((err) => next(err));
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

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

const PORT = config.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on PORT ${PORT}`);
});
