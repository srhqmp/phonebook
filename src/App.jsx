import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1234567" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    const personExists = persons.find(
      (p) => p.name.toLowerCase().trim() === newName.toLowerCase().trim()
    );
    if (personExists) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const person = { name: newName, number: newNumber };
      setPersons((curr) => [...curr, person]);
      setNewName("");
      setNewNumber("");
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
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
      {persons.map((p) => (
        <div key={p.name}>
          {p.name} {p.number}
        </div>
      ))}
    </div>
  );
};

export default App;
