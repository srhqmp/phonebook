const express = require("express");
require("dotenv").config();
const app = express();

const notes = [
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
  res.send(
    `<div>
      <p>Phonebook has info for ${notes.length} persons</p>
      <p>${new Date()}</p>
    </div>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(notes);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const note = notes.find((n) => n.id === id);
  if (!note) {
    return res.status(404).json({ message: `Person with ID ${id} not found` });
  }
  res.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
