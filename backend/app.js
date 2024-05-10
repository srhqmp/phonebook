/* eslint-disable no-unused-vars */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("express-async-errors");

const middlewares = require("./utils/middleware.js");
const usersRouter = require("./controllers/users.js");
const personsRouter = require("./controllers/persons.js");

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

app.use("/api/users", usersRouter);
app.use("/api/persons", personsRouter);

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

module.exports = app;
