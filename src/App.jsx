import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    const personExists = persons.find(
      (p) => p.name.toLowerCase().trim() === newName.toLowerCase().trim()
    );
    if (personExists) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const person = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      };
      setPersons((curr) => [...curr, person]);
      setNewName("");
      setNewNumber("");
    }
  };

  const filteredPersons = persons.filter((p) =>
    p.name.toLowerCase().includes(search.toLocaleLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with{" "}
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <h2>add a new</h2>
      <form onSubmit={onSubmit}>
        <div>
          name:{" "}
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(event) => setNewNumber(event.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filteredPersons.map((p) => (
        <div key={p.id}>
          {p.name} {p.number}
        </div>
      ))}
    </div>
  );
};

export default App;
