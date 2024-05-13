const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }
  const { message, variant = 'error' } = notification

  return <div className={`${variant} notification`}>{message}</div>
}

export default Notification
