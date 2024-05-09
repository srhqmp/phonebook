/* eslint-disable no-unused-vars */
const personsRouter = require("express").Router();
const Person = require("../models/person.js");

personsRouter.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(
      `<div>
          <p>Phonebook has info for ${persons.length} persons</p>
          <p>${new Date()}</p>
        </div>`
    );
  });
});

personsRouter.get("/", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

personsRouter.post("/", (req, res, next) => {
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

personsRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      res.json(person);
    })
    .catch((err) => next(err));
});

personsRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

personsRouter.put("/:id", (req, res, next) => {
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

module.exports = personsRouter;
