import { useState, forwardRef, useImperativeHandle } from "react";

const PersonForm = forwardRef(({ createContact }, refs) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const resetForm = () => {
    setName("");
    setNumber("");
  };

  useImperativeHandle(refs, () => {
    return { resetForm };
  });

  const addContact = (event) => {
    event.preventDefault();

    const person = {
      name: name,
      number: number,
    };

    createContact(person);
  };

  return (
    <div>
      <h2>Add a new</h2>
      <form onSubmit={addContact}>
        <div>
          name:{" "}
          <input
            id="name-input"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          number:{" "}
          <input
            id="number-input"
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
});

PersonForm.displayName = "PersonForm";

export default PersonForm;
