/* eslint-disable no-undef */
const { test, after, before } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");

const helper = require("./test_helper.js");
const Person = require("../models/person.js");
const app = require("../app.js");

const api = supertest(app);

before(async () => {
  await Person.deleteMany({});

  await Promise.all(
    helper.initialPersons.map(async (p) => {
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

test("all persons are returned", async () => {
  const response = await api.get("/api/persons");
  assert.strictEqual(response.body.length, helper.initialPersons.length);
});

test("the first person is named Sarah", async () => {
  const response = await api.get("/api/persons");

  const persons = response.body.map((p) => p.name);
  assert.strictEqual(persons[0], "Sarah");
});

test("a valid number can be added", async () => {
  const newPerson = {
    name: "John Doe",
    number: "12-1122334",
  };

  await api
    .post("/api/persons")
    .send(newPerson)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const personsAtEnd = await helper.personsInDb();
  assert.strictEqual(personsAtEnd.length, helper.initialPersons.length + 1);

  const persons = personsAtEnd.map((p) => p.name);
  assert(persons.includes(newPerson.name));
});

test("a specific person can be viewed", async () => {
  const personsAtStart = await helper.personsInDb();

  const personToView = personsAtStart[0];

  const resultPerson = await api
    .get(`/api/persons/${personToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.deepStrictEqual(personToView, resultPerson.body);
});

test("a person can be deleted", async () => {
  const personsAtStart = await helper.personsInDb();

  const personToDelete = personsAtStart[0];

  await api.delete(`/api/persons/${personToDelete.id}`).expect(204);

  const personsAtEnd = await helper.personsInDb();
  const persons = personsAtEnd.map((p) => p.name);

  assert(!persons.includes(personToDelete.name));
  assert.strictEqual(personsAtEnd.length, personsAtStart.length - 1);
});

test("fails with statuscode 400 id is invalid", async () => {
  const invalidId = "5a3d5da59070081a82a3445";

  await api.get(`/api/persons/${invalidId}`).expect(400);
});

after(async () => {
  mongoose.connection.close();
});
