const Filter = ({ value, handleSearch }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={handleSearch} />
    </div>
  )
}

export default Filter
