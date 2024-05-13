const PersonForm = ({ onSubmit, name, number, handleName, handleNumber }) => {
  return (
    <div>
      <h2>Add a new</h2>
      <form onSubmit={onSubmit}>
        <div>
          name: <input value={name} onChange={handleName} />
        </div>
        <div>
          number: <input value={number} onChange={handleNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
