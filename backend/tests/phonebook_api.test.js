/* eslint-disable no-undef */
const { test, after, before } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");

const Person = require("../models/person.js");
const app = require("../app.js");

const api = supertest(app);

const personList = [
  {
    name: "Sarah",
    number: "09-1234567",
  },
  {
    name: "Jane",
    number: "123-45678912",
  },
];

before(async () => {
  await Person.deleteMany({});
  await Promise.all(
    personList.map(async (p) => {
      const person = new Person(p);
      await person.save();
    })
  );
});

test("phonebook data are returned as json", async () => {
  await api
    .get("/api/persons")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two persons", async () => {
  const response = await api.get("/api/persons");
  assert.strictEqual(response.body.length, 2);
});

test("the first person is named Sarah", async () => {
  const response = await api.get("/api/persons");

  const persons = response.body.map((p) => p.name);
  assert.strictEqual(persons[0], "Sarah");
});

after(async () => {
  mongoose.connection.close();
});
