/* eslint-disable no-unused-vars */
const personsRouter = require("express").Router();

const Person = require("../models/person.js");
const middleware = require("../utils/middleware.js");

personsRouter.get("/info", async (req, res) => {
  const persons = await Person.find({});
  res.send(
    `<div>
          <p>Phonebook has info for ${persons.length} persons</p>
          <p>${new Date()}</p>
        </div>`
  );
});

// TODO: make contacts private?
personsRouter.get("/", async (req, res) => {
  const persons = await Person.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(persons);
});

personsRouter.post("/", middleware.userExtractor, async (req, res, next) => {
  const body = req.body;
  const user = req.user;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "Must contain name and number" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    user: user.id,
  });

  const newPerson = await person.save();
  user.contacts = user.contacts.concat(newPerson._id);
  await user.save();

  res.status(201).json(newPerson);
});

personsRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const person = await Person.findById(id);
  res.json(person);
});

personsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (req, res, next) => {
    const id = req.params.id;
    const user = req.user;
    const person = await Person.findById(id);

    if (person.user.toString() !== user.id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorize to delete this person" });
    }

    await Person.findByIdAndDelete(id);
    res.status(204).end();
  }
);

personsRouter.put("/:id", middleware.userExtractor, async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;
  const person = await Person.findById(id);

  if (person.user.toString() !== user.id.toString()) {
    return res
      .status(401)
      .json({ error: "You are not authorize to update this person" });
  }

  const updatedPerson = await Person.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      number: req.body.number,
    },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );
  res.json(updatedPerson);
});

module.exports = personsRouter;
