import { render, screen } from '@testing-library/react'
import PersonForm from './PersonForm'
import userEvent from '@testing-library/user-event'

test('<PersonForm /> updates parent state and calls onSubmit', async () => {
  const createContact = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<PersonForm createContact={createContact} />)

  const nameInput = container.querySelector('#name-input')
  const numberInput = container.querySelector('#number-input')

  const sendButton = screen.getByText('add')

  await user.type(nameInput, 'Jane Doe')
  await user.type(numberInput, '12-1234567')
  await user.click(sendButton)

  expect(createContact.mock.calls).toHaveLength(1)
  expect(createContact.mock.calls[0][0].name).toBe('Jane Doe')
  expect(createContact.mock.calls[0][0].number).toBe('12-1234567')
})
