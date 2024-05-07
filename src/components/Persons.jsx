const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((p) => (
        <div key={p.id}>
          {p.name} {p.number}
        </div>
      ))}
    </div>
  );
};

export default Persons;
