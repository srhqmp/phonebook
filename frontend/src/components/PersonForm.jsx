import { useState } from "react";

const PersonForm = ({ createContact }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const addContact = (event) => {
    event.preventDefault();

    const person = {
      name: name,
      number: number,
    };

    createContact(person).then((res) => {
      if (res.clearForm) {
        setName("");
        setNumber("");
      }
    });
  };

  return (
    <div>
      <h2>Add a new</h2>
      <form onSubmit={addContact}>
        <div>
          name:{" "}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          number:{" "}
          <input
            value={number}
            onChange={({ target }) => setNumber(target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
