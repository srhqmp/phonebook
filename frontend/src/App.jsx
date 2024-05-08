import { useState, useEffect } from "react";

import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import Notification from "./components/Notification.jsx";

import personService from "./services/persons.js";

const App = () => {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null); // {message: "", variant: ""}

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

  const handleDelete = (person) => {
    personService
      .deleteOne(person.id)
      .then(() => {
        const updatedPersons = persons.filter((p) => p.id !== person.id);
        setPersons(updatedPersons);
        displayNotification(`Deleted ${person.name}`, "success");
      })
      .catch((err) => {
        console.error(err);
        displayNotification(
          `Information of ${person.name} has already been removed from server`,
          "error"
        );
        const updatedPersons = persons.filter((p) => p.id !== person.id);
        setPersons(updatedPersons);
      });
  };

  const displayNotification = (message, variant) => {
    setNotification({ message, variant });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const reset = () => {
    setNewName("");
    setNewNumber("");
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const personExists = persons.find(
      (p) => p.name.toLowerCase().trim() === newName.toLowerCase().trim()
    );

    const person = {
      name: newName,
      number: newNumber,
    };

    if (personExists) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService.update(personExists.id, person).then((res) => {
          setPersons((curr) =>
            curr.map((p) => (p.id === res.data.id ? res.data : p))
          );
          displayNotification(`Updated ${res.data.name}`, "success");
          reset();
        });
      }
      return;
    }

    personService.create(person).then((res) => {
      setPersons((curr) => [...curr, res.data]);
      displayNotification(`Added ${res.data.name}`, "success");
      reset();
    });
  };

  const filteredPersons = persons
    ? persons.filter((p) =>
        p.name.toLowerCase().includes(search.toLocaleLowerCase())
      )
    : [];

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
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
