import { useState, useEffect } from "react";

import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import Notification from "./components/Notification.jsx";

import personService from "./services/persons.js";
import loginService from "./services/login.js";

const App = () => {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null); // {message: "", variant: ""}

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    personService.getAll().then((data) => {
      setPersons(data);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedPhonebookUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      personService.setToken(user.token);
    }
  }, []);

  const displayNotification = (message, variant) => {
    setNotification({ message, variant });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const data = await loginService.login({ username, password });

      window.localStorage.setItem("loggedPhonebookUser", JSON.stringify(data));
      personService.setToken(data.token);

      setUser(data);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error(err);
      displayNotification("Wrong credentials", "error");
    }
  };

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

  const reset = () => {
    setNewName("");
    setNewNumber("");
  };

  const handleError = (err) => {
    console.error(err);
    displayNotification(err.response.data.error, "error");
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
        personService
          .update(personExists.id, person)
          .then((data) => {
            setPersons((curr) =>
              curr.map((p) => (p.id === data.id ? data : p))
            );
            displayNotification(`Updated ${data.name}`, "success");
            reset();
          })
          .catch((err) => handleError(err));
      }
      return;
    }

    personService
      .create(person)
      .then((data) => {
        setPersons((curr) => [...curr, data]);
        displayNotification(`Added ${data.name}`, "success");
        reset();
      })
      .catch((err) => handleError(err));
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
      {user && (
        <p>
          {user.name} logged-in{" "}
          <button
            onClick={() => {
              window.localStorage.removeItem("loggedPhonebookUser");
              setUser(null);
            }}
          >
            logout
          </button>
        </p>
      )}
      {!user && (
        <>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              username{" "}
              <input
                type="text"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div>
              password{" "}
              <input
                type="text"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </>
      )}
      <Filter value={search} handleSearch={handleSearch} />
      {user && (
        <>
          <h2>Add a new</h2>
          <PersonForm
            onSubmit={onSubmit}
            name={newName}
            number={newNumber}
            handleName={handleName}
            handleNumber={handleNumber}
          />
        </>
      )}
      <h2>Numbers</h2>
      <Persons
        persons={filteredPersons}
        handleDelete={handleDelete}
        user={user}
      />
    </div>
  );
};

export default App;
