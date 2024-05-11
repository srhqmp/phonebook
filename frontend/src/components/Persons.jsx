const Persons = ({ persons, handleDelete, user }) => {
  const onClick = (person) => () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      handleDelete(person);
    }
  };

  return (
    <div>
      {persons.map((p) => (
        <div key={p.id}>
          {p.name} {p.number}{" "}
          {user && <button onClick={onClick(p)}>delete</button>}
        </div>
      ))}
    </div>
  );
};

export default Persons;
