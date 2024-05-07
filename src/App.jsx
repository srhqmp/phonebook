import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    personService.getAll().then((res) => {
      setPersons(res.data);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleName = (event) => {
    setNewName(event.target.value);
  };

  const handleNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleDelete = (id) => {
    personService.deleteOne(id).then(() => {
      const updatedPersons = persons.filter((p) => p.id !== id);
      setPersons(updatedPersons);
    });
  };

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
      };

      personService.create(person).then((res) => {
        setPersons((curr) => [...curr, res.data]);
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const filteredPersons = persons
    ? persons.filter((p) =>
        p.name.toLowerCase().includes(search.toLocaleLowerCase())
      )
    : [];

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={search} handleSearch={handleSearch} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={onSubmit}
        name={newName}
        number={newNumber}
        handleName={handleName}
        handleNumber={handleNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
