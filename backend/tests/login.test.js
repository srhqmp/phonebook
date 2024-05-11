const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../models/user.js");
const app = require("../app.js");

const api = supertest(app);

describe("when there is initially one user in db", () => {
  const userData = {
    username: "root",
    password: "secret",
  };

  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash(userData.password, 10);
    const user = new User({ username: userData.username, passwordHash });

    await user.save();
  });

  test("a user can login", async () => {
    const response = await api
      .post("/api/login")
      .send(userData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.username, userData.username);
  });

  test("fails when login with wrong password", async () => {
    await api
      .post("/api/login")
      .send({ ...userData, password: "wrongpw" })
      .expect(401);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
