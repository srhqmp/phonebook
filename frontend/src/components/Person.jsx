const Person = ({ person, handleDelete, user }) => {
  const onClick = (person) => () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      handleDelete(person)
    }
  }

  return (
    <div>
      {person.name} {person.number}
      {user && <button onClick={onClick(person)}>delete</button>}
    </div>
  )
}

export default Person
